// JS/cars.js
import { api } from './api.js';

const grid = document.getElementById('carsGrid');

// Try to read from previous search, else fetch everything
let cars = JSON.parse(localStorage.getItem('searchResults') || 'null');

(async () => {
  // 1) Load cars if none in storage
  if (!cars) {
    cars = await api('/car/all');
  }

  // 2) Fetch all images for current tenant
  const images = await api('/carimage/all');
  const imgMap = images.reduce((map, img) => {
    if (!map[img.car_id]) map[img.car_id] = [];
    map[img.car_id].push(img.image_url);
    return map;
  }, {});

  // 3) Clear the grid
  grid.innerHTML = '';

  // 4) If no cars to show
  if (!cars.length) {
    grid.innerHTML = '<p>No cars found.</p>';
    return;
  }

  // 5) Render each car from backend
  cars.forEach(car => {
    const url = imgMap[car.id]?.[0] || '../Photo/placeholder.jpg';
    const card = document.createElement('div');
    card.className = 'car-card';
    card.innerHTML = `
      <div class="car-image">
        <img src="${url}" alt="${car.make} ${car.model}">
      </div>
      <div class="car-info">
        <h2>${car.make} ${car.model}</h2>
        <div class="car-details">
          <span><i class="fas fa-tag"></i> Type ID: ${car.car_type_id}</span>
          <span><i class="fas fa-gas-pump"></i> ${car.status}</span>
          <span class="price">$${car.total_price}/day</span>
        </div>
      </div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `MyBooking.html?car=${car.id}`;
    });
    grid.appendChild(card);
  });
})();
