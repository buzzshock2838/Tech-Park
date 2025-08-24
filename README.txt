# 🚗 TeckPark - Smart Parking System

A complete web-based parking management system with booking and payment functionality, built for college demonstration purposes.

## ✨ Features

- **🗺️ Interactive Google Maps Integration** - View parking spots on an interactive map
- **📅 Smart Booking System** - Reserve parking spots with date/time selection
- **💳 Multiple Payment Methods** - Support for UPI and Card payments
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **🎨 Modern UI** - Beautiful gradients, animations, and smooth transitions
- **📧 Email Receipts** - Digital receipts sent to user's email
- **🔍 Real-time Search** - Find parking spots near your location
- **💰 Dynamic Pricing** - Automatic price calculation based on duration

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: PHP
- **Database**: MySQL
- **Maps**: Google Maps API
- **Styling**: Custom CSS with gradients and animations

## 📋 Prerequisites

Before installation, ensure you have:

1. **XAMPP/WAMP Server** (for Windows) or **MAMP** (for Mac)
2. **Web Browser** (Chrome, Firefox, Safari, or Edge)
3. **Internet Connection** (for Google Maps API)

## 🚀 Installation Guide

### Step 1: Download and Install XAMPP

1. Download XAMPP from [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Run the installer and follow the setup instructions
3. Install Apache and MySQL components

### Step 2: Setup Project Files

1. Create a folder called `techpark` in your XAMPP `htdocs` directory:
   - Windows: `C:\xampp\htdocs\techpark\`
   - Mac: `/Applications/XAMPP/htdocs/techpark/`

2. Place all the provided files in this folder:
   - `techPark.html`
   - `techPark.css`
   - `techPark.js`
   - `techPark.php`
   - `setup_db.php`
   - `bookings.sql` (optional)

### Step 3: Setup Database

**Option A: Automatic Setup (Recommended)**
1. Open your browser and go to: `http://localhost/techpark/setup_db.php`
2. You should see "Database setup completed!" message

**Option B: Manual Setup**
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Create a new database named `parking_db`
3. Import the `bookings.sql` file or run the SQL commands manually

### Step 4: Configure Google Maps API

1. Open `techPark.html` in a code editor
2. Find the Google Maps API script tag (around line 394):
   ```html
   <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyABumGpGQNzFzFXhF4oiallI4i-us-EuoE&callback=initMap"></script>