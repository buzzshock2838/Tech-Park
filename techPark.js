// Global variables to store booking data
let bookingData = {};

// Mock parking data
const parkingSpots = [
    {
        id: "downtown-plaza",
        name: "Hampankatte",
        address: "123 Main St",
        price: 50,
        available: 15,
        total: 50,
        lat: 12.9716,
        lng: 77.5946
    },
    {
        id: "mall-parking",
        name: "City Center",
        address: "456 Market Ave",
        price: 20,
        available: 8,
        total: 30,
        lat: 12.9726,
        lng: 77.5956
    },
    {
        id: "airport-lot",
        name: "Airport Long-term",
        address: "789 Airport Rd",
        price: 150,
        available: 45,
        total: 200,
        lat: 12.9706,
        lng: 77.5936
    },
    {
        id: "stadium-parking",
        name: "Stadium Parking",
        address: "321 Sports Ln",
        price: 100,
        available: 3,
        total: 20,
        lat: 12.9736,
        lng: 77.5966
    }

];

// Initialize Google Map
let map;
let userLocation = { lat: 12.9716, lng: 77.5946 }; // Default to Bangalore

function initMap() {
    // Initialize map (Mangalore coords)
    map = L.map('map').setView([12.9141, 74.8560], 13);

    // Add OpenStreetMap tiles (no API key needed)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add default marker
    marker = L.marker([12.9141, 74.8560]).addTo(map)
        .bindPopup('📍 TechPark Parking Location')
        .openPopup();

    // Add parking spot markers
    parkingSpots.forEach(spot => {
        const marker = new google.maps.Marker({
            position: { lat: spot.lat, lng: spot.lng },
            map: map,
            title: spot.name,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="#2ecc71"><path d="M12 2L13.09 8.26L22 9L17 14L18.18 22L12 19L5.82 22L7 14L2 9L10.91 8.26L12 2Z"/></svg>'),
                scaledSize: new google.maps.Size(30, 30)
            }
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h3>${spot.name}</h3>
                    <p>${spot.address}</p>
                    <p><strong>₹${spot.price}/hour</strong></p>
                    <p>${spot.available}/${spot.total} spots available</p>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    });

    getUserLocation();
    displayParkingSpots();
}

// Get user's current location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(userLocation);
            },
            () => {
                console.log('Location access denied');
            }
        );
    }
}

// Display parking spots in grid
function displayParkingSpots() {
    const grid = document.getElementById('parkingGrid');
    grid.innerHTML = '';

    parkingSpots.forEach(spot => {
        const statusClass = spot.available > 10 ? 'available' :
                            spot.available > 5 ? 'limited' : 'full';
        const statusText = spot.available > 10 ? 'Available' :
                            spot.available > 5 ? 'Limited' : 'Full';

        const card = document.createElement('div');
        card.className = 'parking-card';
        card.innerHTML = `
            <div class="parking-info">
                <h3>${spot.name}</h3>
                <p>📍 ${spot.address}</p>
                <p>💰 ₹${spot.price}/hour</p>
                <span class="parking-status ${statusClass}">${statusText} (${spot.available}/${spot.total})</span>
            </div>
            <button class="submit-btn" onclick="selectParkingSpot('${spot.id}')">
                Select This Spot
            </button>
        `;
        grid.appendChild(card);
    });
}

// Select parking spot and scroll to booking
function selectParkingSpot(spotId) {
    const locationSelect = document.getElementById('location');
    locationSelect.value = spotId;
    calculatePrice();
    document.getElementById('booking-section').scrollIntoView({
        behavior: 'smooth'
    });
}

// Calculate booking price
function calculatePrice() {
    const locationSelect = document.getElementById('location');
    const durationSelect = document.getElementById('duration');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    
    const location = locationSelect.value;
    const duration = durationSelect.value;
    const selectedDate = dateInput.value;
    const selectedTime = timeInput.value;
    
    if (location && duration) {
        const prices = {
            'downtown-plaza': 10,
            'mall-parking': 20,
            'airport-lot': 50,
            'stadium-parking': 30
        };
        
        const locationNames = {
            'downtown-plaza': 'Hampankatte',
            'mall-parking': 'City Center',
            'airport-lot': 'Airport Long-term',
            'stadium-parking': 'Stadium Parking'
        };
        
        const hourlyRate = prices[location] || 0;
        const durationHours = parseInt(duration);
        const total = hourlyRate * durationHours;
        
        // Store booking data
        bookingData = {
            location: locationNames[location],
            date: selectedDate,
            time: selectedTime,
            duration: durationHours,
            vehicle: '',
            amount: total
        };
        
        // Update price display with detailed breakdown
        const priceDisplay = document.getElementById('totalPrice');
        priceDisplay.innerHTML = `₹${total}`;
        
        // Show detailed breakdown
        const breakdownHtml = `
            <div class="price-breakdown" style="margin-top: 1rem; font-size: 0.9rem; background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px;">
                <h4 style="margin-bottom: 0.5rem; color: #333;">Booking Summary</h4>
                <div class="breakdown-item" style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                    <span><strong>Location:</strong> ${locationNames[location] || 'Selected Location'}</span>
                </div>
                ${selectedDate ? `<div class="breakdown-item" style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                    <span><strong>Date:</strong> ${new Date(selectedDate).toLocaleDateString('en-IN')}</span>
                </div>` : ''}
                ${selectedTime ? `<div class="breakdown-item" style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                    <span><strong>Time:</strong> ${selectedTime}</span>
                </div>` : ''}
                <div class="breakdown-item" style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                    <span><strong>Duration:</strong> ${durationHours} hour${durationHours > 1 ? 's' : ''}</span>
                </div>
                <div class="breakdown-item" style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                    <span><strong>Rate:</strong> ₹${hourlyRate}/hour</span>
                </div>
                <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid #ddd;">
                <div class="breakdown-item" style="display: flex; justify-content: space-between; font-weight: bold; color: #2e7d32;">
                    <span>Total Cost:</span>
                    <span>₹${total}</span>
                </div>
                ${getDiscountInfo(durationHours, total)}
            </div>
        `;
        
        // Add breakdown after price display
        const existingBreakdown = document.querySelector('.price-breakdown');
        if (existingBreakdown) {
            existingBreakdown.remove();
        }
        document.querySelector('.price-display').insertAdjacentHTML('afterend', breakdownHtml);
        
        // Update payment form amounts
        const upiAmountField = document.getElementById('upiAmount');
        const cardAmountField = document.getElementById('cardAmount');
        if (upiAmountField) upiAmountField.value = `₹${total}`;
        if (cardAmountField) cardAmountField.value = `₹${total}`;
        
        // Show cost preview in real-time
        updateLocationCostPreview(location, duration);
    } else {
        // Clear price display if incomplete
        document.getElementById('totalPrice').textContent = '₹0';
        const existingBreakdown = document.querySelector('.price-breakdown');
        if (existingBreakdown) {
            existingBreakdown.remove();
        }
    }
}

// Get discount information based on duration
function getDiscountInfo(hours, total) {
    let discount = '';
    if (hours >= 8) {
        const savings = Math.round(total * 0.1);
        discount = `<div class="discount-info" style="background: #e8f5e8; padding: 0.5rem; border-radius: 5px; margin-top: 0.5rem; color: #2e7d32;">
            <small>🎉 Long duration booking! You could save ₹${savings} with our daily pass.</small>
        </div>`;
    } else if (hours >= 4) {
        discount = `<div class="discount-info" style="background: #fff3e0; padding: 0.5rem; border-radius: 5px; margin-top: 0.5rem; color: #f57c00;">
            <small>💡 Tip: Book for 8+ hours to get daily pass discounts!</small>
        </div>`;
    }
    return discount;
}

// Update cost preview when location or duration changes
function updateLocationCostPreview(location, duration) {
    if (location && duration) {
        const locationSelect = document.getElementById('location');
        const selectedOption = locationSelect.options[locationSelect.selectedIndex];
        const locationText = selectedOption.text;
        
        // Add visual feedback to form
        locationSelect.style.background = '#e8f5e8';
        document.getElementById('duration').style.background = '#e8f5e8';
        
        setTimeout(() => {
            locationSelect.style.background = '';
            document.getElementById('duration').style.background = '';
        }, 1000);
    }
}

// Enhanced completeBooking function with better error handling
async function completeBooking() {
    try {
        // Validate all required fields
        const location = document.getElementById('location').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const duration = document.getElementById('duration').value;
        const vehicle = document.getElementById('vehicle').value;
        const email = document.getElementById('email').value;
        
        if (!location || !date || !time || !duration || !vehicle || !email) {
            showErrorModal('⚠️ Please fill in all required fields before completing your booking');
            return;
        }
        
        // Check if payment method is selected
        const upiSelected = document.querySelector('.upi-btn.selected');
        const cardSelected = document.querySelector('input[name="cardType"]:checked');
        const activePaymentTab = document.querySelector('.tab-btn.active');
        
        if (activePaymentTab.textContent.includes('UPI') && !upiSelected) {
            showErrorModal('⚠️ Please select a UPI payment method first.');
            return;
        }
        
        if (activePaymentTab.textContent.includes('Card') && !cardSelected) {
            showErrorModal('⚠️ Please fill in your card details first.');
            return;
        }
        
        // Show processing message
        showSuccessModal('🔄 Processing your booking and payment... Please wait.');

        // Update booking data with vehicle
        bookingData.vehicle = vehicle;
        bookingData.email = email;

        // Prepare data to send to PHP
        const formData = new FormData();
        let paymentMethod = "";
        if (activePaymentTab.textContent.includes("UPI")) {
            paymentMethod = "UPI";
        } else if (activePaymentTab.textContent.includes("Card")) {
            paymentMethod = "Card";
        }
        
        formData.append("location", location);
        formData.append("date", date);
        formData.append("time", time);
        formData.append("duration", duration);
        formData.append("vehicle", vehicle);
        formData.append("email", email);
        formData.append("amount", bookingData.amount);
        formData.append("payment_method", paymentMethod);

        // Send to backend (PHP)
        const response = await fetch("techPark.php", {
            method: "POST",
            body: formData
        });
        
        const data = await response.json();
        
        document.getElementById('successModal').style.display = 'none';

        if (data.success) {
            showSuccessModal('✅ Payment recorded! Redirecting to confirmation page...');
            setTimeout(() => {
                document.getElementById('successModal').style.display = 'none';
                showSuccessPage();
            }, 1500);
        } else {
            showErrorModal('❌ Failed to save booking: ' + data.error);
        }
    } catch (error) {
        console.error('Booking error:', error);
        showErrorModal('⚠️ Server error while saving booking! Please try again.');
    }
}

// Add error modal function
function showErrorModal(message) {
    // Create error modal if it doesn't exist
    if (!document.getElementById('errorModal')) {
        const modalHTML = `
            <div id="errorModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('errorModal').style.display='none'">&times;</span>
                    <h2 style="text-align: center; color: #e74c3c; margin-bottom: 1rem;">❌ Error!</h2>
                    <p style="text-align: center; font-size: 1.1rem;" id="errorMessage"></p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorModal').style.display = 'block';
}

// Add to your existing event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add error modal styles
    const style = document.createElement('style');
    style.textContent = `
        #errorModal .modal-content {
            background: linear-gradient(135deg, #ff6b6b 0%, #e74c3c 100%);
            color: white;
        }
    `;
    document.head.appendChild(style);
});

// Show success page
function showSuccessPage() {
    const locationNames = {
        'downtown-plaza': 'Hampankatte',
        'mall-parking': 'City Center',
        'airport-lot': 'Airport Long-term',
        'stadium-parking': 'Stadium Parking'
    };
    
    // Hide main content
    document.getElementById('mainContent').classList.add('hidden');
    
    // Update booking details in success page
    document.getElementById('confirmedLocation').textContent = bookingData.location || '--';
    document.getElementById('confirmedDate').textContent = bookingData.date ? new Date(bookingData.date).toLocaleDateString('en-IN') : '--';
    document.getElementById('confirmedTime').textContent = bookingData.time || '--';
    document.getElementById('confirmedDuration').textContent = bookingData.duration ? `${bookingData.duration} hour${bookingData.duration > 1 ? 's' : ''}` : '--';
    document.getElementById('confirmedVehicle').textContent = bookingData.vehicle || '--';
    document.getElementById('confirmedAmount').textContent = bookingData.amount ? `₹${bookingData.amount}` : '--';
    
    // Show success page
    document.getElementById('successPage').style.display = 'block';
    
    // Scroll to top of success page
    window.scrollTo(0, 0);
}

// Download receipt function
function downloadReceipt() {
    const receipt = `
    Parking Receipt
    ------------------------
    Booking ID: ${bookingData.id || 'N/A'}
    Location: ${bookingData.location}
    Date: ${bookingData.date}
    Time: ${bookingData.time}
    Duration: ${bookingData.duration} hours
    Vehicle: ${bookingData.vehicle}
    Email: ${bookingData.email}
    Amount Paid: ₹${bookingData.amount}
    Payment Method: ${bookingData.payment_method}
    ------------------------
    Thank you for booking with TechPark!
    `;

    const blob = new Blob([receipt], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "receipt.txt";
    link.click();
}

// New booking function
function newBooking() {
    // Hide success page
    document.getElementById('successPage').style.display = 'none';
    
    // Show main content
    document.getElementById('mainContent').classList.remove('hidden');
    
    // Reset form
    document.getElementById('bookingForm').reset();
    document.getElementById('upiForm').reset();
    document.getElementById('cardForm').reset();
    document.getElementById('email').value = '';
    
    // Clear price display
    document.getElementById('totalPrice').textContent = '₹0';
    const existingBreakdown = document.querySelector('.price-breakdown');
    if (existingBreakdown) {
        existingBreakdown.remove();
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Clear booking data
    bookingData = {};
}

// Payment method switching
function showPaymentMethod(e, method) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Show/hide payment forms
    if (method === 'upi') {
        document.getElementById('upiPayment').style.display = 'block';
        document.getElementById('cardPayment').style.display = 'none';
    } else {
        document.getElementById('upiPayment').style.display = 'none';
        document.getElementById('cardPayment').style.display = 'block';
    }
}

// UPI selection
function selectUPI(e, provider) {
    // Remove previous selections
    document.querySelectorAll('.upi-btn').forEach(btn => btn.classList.remove('selected'));

    // Add selection to clicked button
    e.currentTarget.classList.add('selected');
    
    // Show QR code section
    document.getElementById('qrSection').style.display = 'block';
    
    // Update UPI ID placeholder based on provider
    const upiInput = document.getElementById('upiId');
    switch(provider) {
        case 'gpay':
            upiInput.placeholder = 'yourname@okaxis';
            break;
        case 'phonepe':
            upiInput.placeholder = '9876543210@ybl';
            break;
        case 'paytm':
            upiInput.placeholder = '9876543210@paytm';
            break;
        default:
            upiInput.placeholder = 'yourname@upi';
    }
}

// Format card number
function formatCardNumber(input) {
    const value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = value.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
        parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
        return parts.join(' ');
    } else {
        return match;
    }
}

// Format expiry date
function formatExpiry(input) {
    const value = input.value.replace(/\D/g, '');
    if (value.length >= 3) {
        return value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    return value;
}

// Show success modal
function showSuccessModal(message) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successModal').style.display = 'block';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Booking form submission
    document.getElementById('bookingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate booking form
        const location = document.getElementById('location').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const duration = document.getElementById('duration').value;
        const vehicle = document.getElementById('vehicle').value;
        
        if (!location || !date || !time || !duration || !vehicle) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Show success message and scroll to payment
        showSuccessModal('🎉 Parking spot reserved successfully! Please proceed to select your payment method below.');
        
        // Scroll to payment section after a short delay
        setTimeout(() => {
            document.getElementById('payment-section').scrollIntoView({
                behavior: 'smooth'
            });
        }, 1000);
    });

    // UPI form submission
    document.getElementById('upiForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedUPI = document.querySelector('.upi-btn.selected');
        const upiId = document.getElementById('upiId').value;
        
        if (!selectedUPI) {
            alert('Please select a UPI payment method first.');
            return;
        }
        
        if (!upiId) {
            alert('Please enter your UPI ID.');
            return;
        }
        
        showSuccessModal('💳 UPI payment method configured successfully! Now click the "Complete Booking & Pay" button below to finish your reservation.');
        
        // Scroll to final submit button
        setTimeout(() => {
            document.querySelector('.final-submit-section').scrollIntoView({
                behavior: 'smooth'
            });
        }, 1000);
    });

    // Card form submission
    document.getElementById('cardForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const cardType = document.querySelector('input[name="cardType"]:checked').value;
        const cardName = document.getElementById('cardName').value;
        const cardNumber = document.getElementById('cardNumber').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!cardName || !cardNumber || !expiry || !cvv) {
            alert('Please fill in all card details.');
            return;
        }
        
        showSuccessModal(`💎 ${cardType.charAt(0).toUpperCase() + cardType.slice(1)} card details saved successfully! Now click the "Complete Booking & Pay" button below to finish your reservation.`);
        
        // Scroll to final submit button
        setTimeout(() => {
            document.querySelector('.final-submit-section').scrollIntoView({
                behavior: 'smooth'
            });
        }, 1000);
    });

    // Price calculation with real-time updates
    document.getElementById('location').addEventListener('change', calculatePrice);
    document.getElementById('duration').addEventListener('change', calculatePrice);
    document.getElementById('date').addEventListener('change', calculatePrice);
    document.getElementById('time').addEventListener('change', calculatePrice);

    // Update booking data when vehicle changes
    document.getElementById('vehicle').addEventListener('input', (e) => {
        bookingData.vehicle = e.target.value;
    });

    // Card formatting
    document.getElementById('cardNumber').addEventListener('input', (e) => {
        e.target.value = formatCardNumber(e.target);
    });

    document.getElementById('expiry').addEventListener('input', (e) => {
        e.target.value = formatExpiry(e.target);
    });

    // Modal close
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('successModal').style.display = 'none';
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('successModal')) {
            document.getElementById('successModal').style.display = 'none';
        }
    });

    // Set minimum date to today
    document.getElementById('date').min = new Date().toISOString().split('T')[0];
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

window.onload = initMap;