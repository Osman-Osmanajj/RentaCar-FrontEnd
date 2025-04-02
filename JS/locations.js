document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Location data
    const locations = {
        pristina: {
            name: "Pristina",
            address: "Rr. Nëna Terezë 45, Pristina",
            phone: "+383 44 123 456",
            hours: "Mon-Sun: 8:00 AM - 8:00 PM",
            coords: [42.6629, 21.1655],
            cars: [
                {
                    id: 1,
                    name: "BMW X5",
                    type: "SUV",
                    transmission: "Automatic",
                    fuel: "Petrol",
                    price: 65,
                    image: "../Photo/bmwx5.jpg"
                },
                {
                    id: 2,
                    name: "Audi A6",
                    type: "Sedan",
                    transmission: "Automatic",
                    fuel: "Petrol",
                    price: 55,
                    image: "../Photo/audia6.jpg"
                },
                {
                    id: 3,
                    name: "Mercedes S Class",
                    type: "Luxury",
                    transmission: "Automatic",
                    fuel: "Petrol",
                    price: 90,
                    image: "../Photo/sclass.jpg"
                },
                {
                    id: 4,
                    name: "Golf 8",
                    type: "Hatchback",
                    transmission: "Automatic",
                    fuel: "Petrol",
                    price: 50,
                    image: "../Photo/golf8.jpg"
                }
            ]
        },
        prizren: {
            name: "Prizren",
            address: "Rr. Deshmoret e Kombit 12, Prizren",
            phone: "+383 44 234 567",
            hours: "Mon-Sun: 9:00 AM - 7:00 PM",
            coords: [42.2139, 20.7396],
            cars: [
                {
                    id: 5,
                    name: "BMW X3",
                    type: "SUV",
                    transmission: "Automatic",
                    fuel: "Petrol",
                    price: 55,
                    image: "../Photo/bmwx3.jpg"
                },
                {
                    id: 6,
                    name: "Audi A5",
                    type: "Coupe",
                    transmission: "Automatic",
                    fuel: "Petrol",
                    price: 45,
                    image: "../Photo/audia5.jpg"
                },
                {
                    id: 7,
                    name: "Passat B8",
                    type: "Sedan",
                    transmission: "Automatic",
                    fuel: "Petrol",
                    price: 45,
                    image: "../Photo/passat.jpg"
                }
            ]
        },
        gjakova: {
            name: "Gjakova",
            address: "Rr. Ismail Qemali 8, Gjakova",
            phone: "+383 44 345 678",
            hours: "Mon-Sat: 8:00 AM - 6:00 PM",
            coords: [42.3803, 20.4308],
            cars: [
                {
                    id: 8,
                    name: "Skoda Rapid",
                    type: "Sedan",
                    transmission: "Manual",
                    fuel: "Petrol",
                    price: 20,
                    image: "../Photo/skoda rapid.jpg"
                },
                {
                    id: 9,
                    name: "Golf 6",
                    type: "Hatchback",
                    transmission: "Manual",
                    fuel: "Petrol",
                    price: 35,
                    image: "../Photo/golf6.jpg"
                },
                {
                    id: 10,
                    name: "Audi A3",
                    type: "Hatchback",
                    transmission: "Manual",
                    fuel: "Petrol",
                    price: 35,
                    image: "../Photo/audia3.jpg"
                }
            ]
        }
    };

    // Initialize map
    let map = L.map('locationMap').setView([42.6026, 20.9030], 8); // Centered on Kosovo

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers for each location
    Object.keys(locations).forEach(locKey => {
        const loc = locations[locKey];
        const marker = L.marker(loc.coords).addTo(map)
            .bindPopup(`<b>SpeedyRent ${loc.name}</b><br>${loc.address}`);
        
        // Highlight marker when location tab is clicked
        document.querySelector(`.location-tab[data-location="${locKey}"]`).addEventListener('click', function() {
            map.setView(loc.coords, 13);
            marker.openPopup();
        });
    });

    // Set initial location from URL parameter or default to Pristina
    const urlParams = new URLSearchParams(window.location.search);
    const initialLocation = urlParams.get('location') || 'pristina';
    
    // Update UI for initial location
    updateLocationUI(initialLocation);

    // Location tab switching
    const locationTabs = document.querySelectorAll('.location-tab');
    locationTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const location = this.dataset.location;
            
            // Update active tab
            locationTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update UI
            updateLocationUI(location);
            
            // Update URL without reloading
            window.history.pushState({}, '', `?location=${location}`);
        });
    });

    // Function to update UI for a specific location
    function updateLocationUI(locationKey) {
        const location = locations[locationKey];
        
        // Update location info
        document.getElementById('currentLocation').textContent = location.name;
        document.getElementById('locationAddress').textContent = location.address;
        document.getElementById('locationPhone').textContent = location.phone;
        document.getElementById('locationHours').textContent = location.hours;
        document.getElementById('locationName').textContent = location.name;
        
        // Update cars grid
        const carsGrid = document.getElementById('locationCarsGrid');
        carsGrid.innerHTML = '';
        
        location.cars.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = 'car-card';
            carCard.innerHTML = `
                <div class="car-image">
                    <img src="${car.image}" alt="${car.name}">
                </div>
                <div class="car-info">
                    <h3>${car.name}</h3>
                    <div class="car-details">
                        <span><i class="fas fa-car"></i> ${car.type}</span>
                        <span><i class="fas fa-cog"></i> ${car.transmission}</span>
                        <span><i class="fas fa-gas-pump"></i> ${car.fuel}</span>
                    </div>
                    <div class="car-price">
                        <div class="price">$${car.price} <span>/day</span></div>
                        <button class="book-btn">Book Now</button>
                    </div>
                </div>
            `;
            carsGrid.appendChild(carCard);
        });
        
        // Set active tab
        locationTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.location === locationKey) {
                tab.classList.add('active');
            }
        });
        
        // Center map on location
        map.setView(location.coords, 13);
    }
});