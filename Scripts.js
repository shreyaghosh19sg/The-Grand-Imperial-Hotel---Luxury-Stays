// Function to render rooms
            function renderRooms(rooms) {
                roomListings.innerHTML = ''; // Clear previous listings
                if (rooms.length === 0) {
                    roomListings.innerHTML = '<p>No rooms found matching your criteria. Please adjust your search.</p>';
                    return;
                }

                rooms.forEach(room => {
                    const roomCard = document.createElement('div');
                    roomCard.classList.add('room-card');
                    roomCard.innerHTML = `
                        <img src="${room.image}" alt="${room.name}">
                        <h3>${room.name}</h3>
                        <p>${room.description}</p>
                        <div class="room-details">
                            <span><i class="fas fa-user"></i> ${room.guests} Guest${room.guests > 1 ? 's' : ''}</span>
                            <span><i class="fas fa-bed"></i> ${room.type}</span>
                            <span><i class="fas fa-ruler-combined"></i> Spacious</span>
                        </div>
                        <div class="room-price">₹${room.pricePerNight.toLocaleString()}/night</div>
                        <button class="btn btn-primary book-room-btn" data-room-id="${room.id}">Book Now</button>
                    `;
                    roomListings.appendChild(roomCard);
                });

                // Add event listeners to new "Book Now" buttons
                document.querySelectorAll('.book-room-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const roomId = this.dataset.roomId;
                        selectedRoom = availableRooms.find(room => room.id === roomId);
                        if (selectedRoom && bookingDates.checkIn && bookingDates.checkOut) {
                            showBookingDetails();
                        } else {
                            displayMessage(roomListMessage, 'Please select valid check-in and check-out dates first.', 'error');
                            // Scroll to the search section if dates are missing
                            searchSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    });
                });
            }

            // Function to calculate number of nights
            function calculateNights(checkIn, checkOut) {
                const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                const firstDate = new Date(checkIn);
                const secondDate = new Date(checkOut);
                return Math.round(Math.abs((firstDate - secondDate) / oneDay));
            }

            // Function to show booking details section
            function showBookingDetails() {
                if (!selectedRoom || !bookingDates.checkIn || !bookingDates.checkOut) {
                    displayMessage(bookingMessage, 'Please select a room and valid dates to proceed with booking.', 'error');
                    return;
                }

                const numberOfNights = calculateNights(bookingDates.checkIn, bookingDates.checkOut);
                const totalAmount = selectedRoom.pricePerNight * numberOfNights;

                bookingSummaryDiv.innerHTML = `
                    <h3>Your Booking Summary</h3>
                    <p><strong>Room:</strong> ${selectedRoom.name}</p>
                    <p><strong>Check-in:</strong> ${bookingDates.checkIn}</p>
                    <p><strong>Check-out:</strong> ${bookingDates.checkOut}</p>
                    <p><strong>Guests:</strong> ${numberOfGuests}</p>
                    <p><strong>Nights:</strong> ${numberOfNights}</p>
                    <p><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString()}</p>
                `;

                roomsSection.style.display = 'none';
                searchSection.style.display = 'none';
                bookingConfirmationSection.style.display = 'none';
                bookingDetailsSection.style.display = 'block';
                bookingDetailsSection.scrollIntoView({ behavior: 'smooth' });
            }

            // Handle room search form submission
            document.getElementById('room-search-form').addEventListener('submit', function(event) {
                event.preventDefault();

                const checkInDate = document.getElementById('check-in').value;
                const checkOutDate = document.getElementById('check-out').value;
                const guests = parseInt(document.getElementById('guests').value);
                const roomType = document.getElementById('room-type').value;

                if (!checkInDate || !checkOutDate) {
                    displayMessage(roomListMessage, 'Please select both check-in and check-out dates.', 'error');
                    return;
                }

                const cIn = new Date(checkInDate);
                const cOut = new Date(checkOutDate);

                if (cIn >= cOut) {
                    displayMessage(roomListMessage, 'Check-out date must be after check-in date.', 'error');
                    return;
                }
                if (cIn < new Date().setHours(0,0,0,0)) { // Ensure check-in is not in the past
                    displayMessage(roomListMessage, 'Check-in date cannot be in the past.', 'error');
                    return;
                }

                bookingDates.checkIn = checkInDate;
                bookingDates.checkOut = checkOutDate;
                numberOfGuests = guests;

                // Simulate filtering rooms based on criteria
                availableRooms = allRooms.filter(room => {
                    const matchesGuests = (guests >= 4) ? room.guests >= 4 : room.guests === guests;
                    const matchesType = (roomType === 'any' || room.type === roomType);
                    // Add more complex availability logic here if needed (e.g., checking actual dates)
                    return matchesGuests && matchesType;
                });

                renderRooms(availableRooms);
                roomsSection.style.display = 'block';
                roomsSection.scrollIntoView({ behavior: 'smooth' });
                displayMessage(roomListMessage, `Displaying rooms for ${guests} guest(s) from ${checkInDate} to ${checkOutDate}.`, 'success');
            });

            // Handle payment form submission
            paymentForm.addEventListener('submit', function(event) {
                event.preventDefault();

                const guestName = document.getElementById('guest-name').value;
                const guestEmail = document.getElementById('guest-email').value;
                const cardNumber = document.getElementById('card-number').value;
                const expiryDate = document.getElementById('expiry-date').value;
                const cvv = document.getElementById('cvv').value;

                // Basic validation
                if (!guestName || !guestEmail || !cardNumber || !expiryDate || !cvv) {
                    displayMessage(bookingMessage, 'Please fill in all payment details.', 'error');
                    return;
                }

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
                    displayMessage(bookingMessage, 'Please enter a valid email address.', 'error');
                    return;
                }

                // Simulate payment processing
                setTimeout(() => {
                    const paymentSuccess = Math.random() > 0.1; // 90% success rate
                    if (paymentSuccess) {
                        showBookingConfirmation(guestName, guestEmail);
                        displayMessage(bookingMessage, 'Payment successful! Redirecting to confirmation...', 'success');
                    } else {
                        displayMessage(bookingMessage, 'Payment failed. Please check your details and try again.', 'error');
                    }
                }, 1500); // Simulate network delay
            });

            // Function to show booking confirmation section
            function showBookingConfirmation(guestName, guestEmail) {
                const numberOfNights = calculateNights(bookingDates.checkIn, bookingDates.checkOut);
                const totalAmount = selectedRoom.pricePerNight * numberOfNights;
                const confirmationId = 'TGI-' + Math.random().toString(36).substr(2, 9).toUpperCase(); // Simple unique ID

                confirmationDetailsDiv.innerHTML = `
                    <h3>Thank You for Your Booking!</h3>
                    <p>Your reservation at The Grand Imperial Hotel is confirmed.</p>
                    <p><strong>Confirmation ID:</strong> <span>${confirmationId}</span></p>
                    <p><strong>Guest Name:</strong> ${guestName}</p>
                    <p><strong>Email:</strong> ${guestEmail}</p>
                    <p><strong>Room Type:</strong> ${selectedRoom.name}</p>
                    <p><strong>Check-in:</strong> ${bookingDates.checkIn}</p>
                    <p><strong>Check-out:</strong> ${bookingDates.checkOut}</p>
                    <p><strong>Total Amount Paid:</strong> ₹${totalAmount.toLocaleString()}</p>
                    <p>A detailed confirmation email has been sent to ${guestEmail}. We look forward to welcoming you!</p>
                `;

                bookingDetailsSection.style.display = 'none';
                bookingConfirmationSection.style.display = 'block';
                bookingConfirmationSection.scrollIntoView({ behavior: 'smooth' });
            }

            // Initial render of all rooms when page loads
            renderRooms(allRooms);
            document.querySelector('.loading-message').style.display = 'none'; // Hide loading message
        });