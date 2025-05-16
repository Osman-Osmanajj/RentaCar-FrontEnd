// JS/home.js
import { api, setTenant } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  // ─── Mobile menu toggle ──────────────────────────────────────────
  const mobileMenuBtn = document.querySelector('.mobile-menu');
  const navMenu       = document.querySelector('nav ul');
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // ─── Populate locations dropdown ─────────────────────────────────
  const locationSelect = document.getElementById('pickup-location');
  const carTypeSelect  = document.getElementById('car-type');
  try {
    const { tenants } = await api('/tenants/tenants');
    tenants.forEach(t => {
      const opt = document.createElement('option');
      opt.value       = t.id;
      opt.textContent = `${t.name} — ${t.address}, ${t.city}`;
      locationSelect.appendChild(opt);
    });
  } catch (err) {
    console.error('Error loading locations:', err);
  }

  // ─── When a location is chosen, set tenant + load car types ─────
  locationSelect.addEventListener('change', async () => {
    const tenantIdVal = locationSelect.value;
    if (!tenantIdVal) {
      carTypeSelect.innerHTML = '<option value="">Select Car Type</option>';
      return;
    }

    setTenant(tenantIdVal);
    console.log(`[home.js] setTenant(${tenantIdVal})`);

    try {
      // 🔑 No custom headers here — api() will inject X-Tenant-ID for you
      const types = await api('/cartypes/all');
      console.log('[home.js] fetched car types:', types);

      carTypeSelect.innerHTML = '<option value="">Select Car Type</option>';
      types.forEach(ct => {
        const opt = document.createElement('option');
        opt.value       = ct.id;
        opt.textContent = ct.name;
        carTypeSelect.appendChild(opt);
      });
    } catch (err) {
      console.error('Error loading car types:', err);
      alert('Failed to load car types — check console for details');
    }
  });

  // ─── Date pickers: enforce today ≤ pickup ≤ return ──────────────
  const today       = new Date().toISOString().split('T')[0];
  const pickupDate  = document.getElementById('pickup-date');
  const returnDate  = document.getElementById('return-date');
  if (pickupDate) {
    pickupDate.min = today;
    pickupDate.addEventListener('change', () => {
      returnDate.min = pickupDate.value;
      if (returnDate.value < pickupDate.value) {
        returnDate.value = pickupDate.value;
      }
    });
  }
  if (returnDate) {
    returnDate.min = today;
  }

  // ─── Handle search form submission ───────────────────────────────
  document.getElementById('searchForm')?.addEventListener('submit', async e => {
    e.preventDefault();

    const tenantIdVal = locationSelect.value;
    const from        = pickupDate.value;
    const to          = returnDate.value;
    const type        = carTypeSelect.value;

    if (!tenantIdVal) return alert('Please select a pickup location.');
    if (!from || !to) return alert('Please select both pickup and return dates.');
    if (!type)        return alert('Please select a car type.');

    try {
      // fetch all cars in this tenant
      const cars = await api('/car/all');
      // client-side filter by type + availability
      const filtered = cars.filter(c =>
        +c.car_type_id === +type && c.status === 'Available'
      );

      localStorage.setItem('searchResults', JSON.stringify(filtered));
      localStorage.setItem('searchDates', JSON.stringify({ from, to }));
      window.location.href = 'Cars.html';
    } catch (err) {
      console.error('Search error:', err);
      alert('Failed to search cars. Check console.');
    }
  });
});
