import { api, setTenant } from './api.js';

const grid = document.getElementById('carsGrid');
const locationSelect = document.createElement('select');
locationSelect.id = 'pickup-location';
locationSelect.style = 'margin-bottom:1.5rem;display:block;';
const locationLabel = document.createElement('label');
locationLabel.htmlFor = 'pickup-location';
locationLabel.style.fontWeight = 'bold';
locationLabel.textContent = 'Pickup Location:';

const mainContainer = document.querySelector('.container .page-header');
mainContainer.insertAdjacentElement('afterend', locationLabel);
locationLabel.insertAdjacentElement('afterend', locationSelect);

locationSelect.innerHTML = '<option value="">Select Location</option>';

let cars = JSON.parse(localStorage.getItem('searchResults') || 'null');

(async function populateLocations() {
  try {
    const { tenants } = await api('/tenants/tenants');
    tenants.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `${t.name} — ${t.address}, ${t.city}`;
      locationSelect.appendChild(opt);
    });

    const savedTenant = localStorage.getItem('tenant_id');
    if (savedTenant) {
      locationSelect.value = savedTenant;
      setTenant(savedTenant);
      await loadCarsForLocation(savedTenant);
    } else if (tenants.length) {
       locationSelect.value = tenants[5].id;
       setTenant(tenants[5].id);
       await loadCarsForLocation(tenants[5].id);
    }
  } catch (err) {
    grid.innerHTML = `<p class="error">Failed to load locations: ${err.message}</p>`;
  }
})();

locationSelect.addEventListener('change', async () => {
  const tenantIdVal = locationSelect.value;
  if (!tenantIdVal) {
    grid.innerHTML = '';
    return;
  }
  setTenant(tenantIdVal);
  localStorage.setItem('tenant_id', tenantIdVal);
  await loadCarsForLocation(tenantIdVal);
});

function renderCars(cars, imgMap) {
  grid.innerHTML = '';
  if (!cars.length) {
    grid.innerHTML = '<p>No cars available.</p>';
    return;
  }
  cars.forEach(car => {
    const url = imgMap[car.id]?.[0] || 'https://via.placeholder.com/300x200?text=No+Image';
    const card = document.createElement('div');
    card.className = 'car-card';
    card.innerHTML = `
      <div class="car-image">
        <img src="${url}" alt="${car.make} ${car.model}">
      </div>
      <div class="car-info">
        <h2>${car.make} ${car.model}</h2>
        <div class="car-details">
          <span><i class="fas fa-tag"></i> ${car.CarType?.name || 'N/A'}</span>
          <span><i class="fas fa-gas-pump"></i> ${car.status}</span>
          <span class="price">$${car.price || '–'}/day</span>
        </div>
      </div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `MyBooking.html?car=${car.id}`;
    });
    grid.appendChild(card);
  });
}

async function loadCarsForLocation(tenantId) {
  grid.innerHTML = '<p>Loading cars...</p>';
  let filteredCars = null;
  if (cars && Array.isArray(cars)) {
    filteredCars = cars.filter(c => c.status === 'Available');
    localStorage.removeItem('searchResults');
    cars = null; 
  } else {
    try {
      const allCars = await api('/car/all');
      filteredCars = allCars.filter(c => c.status === 'Available');
    } catch (err) {
      grid.innerHTML = `<p class="error">Error loading cars: ${err.message}</p>`;
      return;
    }
  }
  let images = [];
  try {
    images = await api('/carimage/all');
  } catch (err) { /* just show cars without images */ }
  const imgMap = images.reduce((map, img) => {
    if (!map[img.car_id]) map[img.car_id] = [];
    map[img.car_id].push(img.image_url);
    return map;
  }, {});
  renderCars(filteredCars, imgMap);
}

if (cars && Array.isArray(cars)) {
}
