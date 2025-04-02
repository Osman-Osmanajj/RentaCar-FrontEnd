document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Handle search form submission
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const pickupLocation = document.getElementById('pickup-location').value;
            const pickupDate = document.getElementById('pickup-date').value;
            const returnDate = document.getElementById('return-date').value;
            const carType = document.getElementById('car-type').value;
            
            // In a real application, you would process this data
            console.log('Search submitted:', {
                pickupLocation,
                pickupDate,
                returnDate,
                carType
            });
            
            // Redirect to cars page with search parameters
            window.location.href = `cars.html?location=${encodeURIComponent(pickupLocation)}&from=${pickupDate}&to=${returnDate}&type=${carType}`;
        });
    }

    // Load featured cars dynamically
    const featuredCarsContainer = document.getElementById('featuredCars');
    if (featuredCarsContainer) {
        const featuredCars = [
            {
                id: 1,
                name: "Toyota Camry",
                type: "Sedan",
                seats: 5,
                fuel: "Hybrid",
                price: 45,
                image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            },
            {
                id: 2,
                name: "Ford Explorer",
                type: "SUV",
                seats: 7,
                fuel: "Petrol",
                price: 75,
                image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            },
            {
                id: 3,
                name: "BMW 5 Series",
                type: "Luxury",
                seats: 5,
                fuel: "Diesel",
                price: 120,
                image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            }
        ];

        featuredCars.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = 'car-card';
            carCard.innerHTML = `
                <div class="car-img">
                    <img src="${car.image}" alt="${car.name}">
                </div>
                <div class="car-info">
                    <h3>${car.name}</h3>
                    <div class="car-specs">
                        <span><i class="fas fa-car"></i> ${car.type}</span>
                        <span><i class="fas fa-users"></i> ${car.seats} Seats</span>
                        <span><i class="fas fa-gas-pump"></i> ${car.fuel}</span>
                    </div>
                    <div class="car-price">
                        <div class="price">$${car.price} <span>/day</span></div>
                        <a href="cars.html#car-${car.id}" class="btn">Book Now</a>
                    </div>
                </div>
            `;
            featuredCarsContainer.appendChild(carCard);
        });
    }

    // Load testimonials dynamically
    const testimonialsContainer = document.getElementById('testimonialsContainer');
    if (testimonialsContainer) {
        const testimonials = [
            {
                text: "The rental process was smooth and easy. The car was clean and in perfect condition. Will definitely use DriveEasy again!",
                author: "Sarah Johnson",
                role: "Business Traveler",
                image: "https://randomuser.me/api/portraits/women/32.jpg"
            },
            {
                text: "Great prices and excellent customer service. The pickup and drop-off process was quick and hassle-free. Highly recommended!",
                author: "Michael Chen",
                role: "Family Vacation",
                image: "https://randomuser.me/api/portraits/men/45.jpg"
            },
            {
                text: "I've rented from many companies before, but DriveEasy stands out for their professionalism and quality vehicles.",
                author: "Emily Rodriguez",
                role: "Frequent Renter",
                image: "https://randomuser.me/api/portraits/women/68.jpg"
            }
        ];

        testimonials.forEach(testimonial => {
            const testimonialElement = document.createElement('div');
            testimonialElement.className = 'testimonial';
            testimonialElement.innerHTML = `
                <div class="testimonial-text">
                    "${testimonial.text}"
                </div>
                <div class="testimonial-author">
                    <div class="author-img">
                        <img src="${testimonial.image}" alt="${testimonial.author}">
                    </div>
                    <div class="author-info">
                        <h4>${testimonial.author}</h4>
                        <p>${testimonial.role}</p>
                    </div>
                </div>
            `;
            testimonialsContainer.appendChild(testimonialElement);
        });
    }

    // Set minimum date for pickup and return dates
    const today = new Date().toISOString().split('T')[0];
    const pickupDateInput = document.getElementById('pickup-date');
    const returnDateInput = document.getElementById('return-date');
    
    if (pickupDateInput) {
        pickupDateInput.min = today;
        pickupDateInput.addEventListener('change', function() {
            if (returnDateInput) {
                returnDateInput.min = this.value;
                if (returnDateInput.value && returnDateInput.value < this.value) {
                    returnDateInput.value = this.value;
                }
            }
        });
    }
    
    if (returnDateInput) {
        returnDateInput.min = today;
    }
});