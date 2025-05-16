import { api } from '../api.js';
const base = '/super/tenants';

const form            = document.getElementById('tenant-form');
const saveBtn         = document.getElementById('save-tenant-btn');
const cancelBtn       = document.getElementById('cancel-tenant-btn');
const idInput         = document.getElementById('tenant-id');
const nameInput       = document.getElementById('tenant-name');
const emailInput      = document.getElementById('tenant-email');
const phoneInput      = document.getElementById('tenant-phone');
const addressInput    = document.getElementById('tenant-address');
const cityInput       = document.getElementById('tenant-city');
const countryInput    = document.getElementById('tenant-country');
const tableBody       = document.querySelector('#tenants-table tbody');

async function loadTenants() {
  const { tenants } = await api(base);
  tableBody.innerHTML = '';
  tenants.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${t.name}</td>
      <td>${t.city}</td>
      <td>${t.email}</td>
      <td>
        <button class="button-small btn-edit" data-id="${t.id}">Edit</button>
        <button class="button-small btn-delete" data-id="${t.id}">Delete</button>
      </td>`;
    tableBody.appendChild(tr);
  });

  // Edit handlers
  tableBody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.onclick = () => {
      const t = tenants.find(x => x.id == btn.dataset.id);
      idInput.value      = t.id;
      nameInput.value    = t.name;
      emailInput.value   = t.email;
      phoneInput.value   = t.phone;
      addressInput.value = t.address;
      cityInput.value    = t.city;
      countryInput.value = t.country;
      saveBtn.textContent = 'Update Tenant';
      cancelBtn.style.display = 'inline-block';
    };
  });

  // Delete handlers
  tableBody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.onclick = async () => {
      if (!confirm('Delete tenant?')) return;
      await api(`${base}/${btn.dataset.id}`, { method:'DELETE' });
      loadTenants();
    };
  });
}

// Cancel edit
cancelBtn.onclick = () => {
  form.reset(); idInput.value='';
  saveBtn.textContent='Save Tenant';
  cancelBtn.style.display='none';
};

// Form submit
form.onsubmit = async e => {
  e.preventDefault();
  const payload = {
    name:    nameInput.value.trim(),
    email:   emailInput.value.trim(),
    phone:   phoneInput.value.trim(),
    address: addressInput.value.trim(),
    city:    cityInput.value.trim(),
    country: countryInput.value.trim(),
  };
  if (idInput.value) {
    await api(`${base}/${idInput.value}`, { method:'PATCH', body: payload });
  } else {
    await api(base, { method:'POST', body: payload });
  }
  form.reset(); idInput.value='';
  saveBtn.textContent='Save Tenant';
  cancelBtn.style.display='none';
  loadTenants();
};

loadTenants();