<?php
header('Content-Type: application/json');

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "parking_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Check if database exists, create if not
$db_check = $conn->select_db($dbname);
if (!$db_check) {
    // Create database
    if ($conn->query("CREATE DATABASE $dbname")) {
        $conn->select_db($dbname);
        // Create table
        $table_sql = "
        CREATE TABLE bookings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            location VARCHAR(100) NOT NULL,
            date DATE NOT NULL,
            time TIME NOT NULL,
            duration INT NOT NULL,
            vehicle VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            payment_method VARCHAR(50) NOT NULL,
            payment_status ENUM('Pending','Success','Failed') DEFAULT 'Success',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        
        if (!$conn->query($table_sql)) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Table creation failed: " . $conn->error]);
            exit;
        }
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Database creation failed: " . $conn->error]);
        exit;
    }
}

// Collect POST data with validation
$required_fields = ['location', 'date', 'time', 'duration', 'vehicle', 'email', 'amount', 'payment_method'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (!isset($_POST[$field]) || empty($_POST[$field])) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing required fields: " . implode(', ', $missing_fields)]);
    exit;
}

$location = $conn->real_escape_string($_POST['location']);
$date = $conn->real_escape_string($_POST['date']);
$time = $conn->real_escape_string($_POST['time']);
$duration = (int)$_POST['duration'];
$vehicle = $conn->real_escape_string($_POST['vehicle']);
$email = $conn->real_escape_string($_POST['email']);
$amount = (float)$_POST['amount'];
$payment_method = $conn->real_escape_string($_POST['payment_method']);

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid email format"]);
    exit;
}

// For college demo, always mark as "Success"
$payment_status = "Success";

// Insert into DB
$stmt = $conn->prepare("INSERT INTO bookings (location, date, time, duration, vehicle, email, amount, payment_method, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssissdss", $location, $date, $time, $duration, $vehicle, $email, $amount, $payment_method, $payment_status);

if ($stmt->execute()) {
    $booking_id = $stmt->insert_id;
    echo json_encode([
        "success" => true, 
        "booking_id" => $booking_id,
        "message" => "Booking saved successfully"
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>