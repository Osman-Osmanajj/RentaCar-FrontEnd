import { api } from '../api.js';

const tenantForm       = document.getElementById('tenant-form');
const saveTenantBtn    = document.getElementById('save-tenant-btn');
const cancelTenantBtn  = document.getElementById('cancel-tenant-btn');
const tIdInput         = document.getElementById('tenant-id');
const tName            = document.getElementById('tenant-name');
const tEmail           = document.getElementById('tenant-email');
const tPhone           = document.getElementById('tenant-phone');
const tAddress         = document.getElementById('tenant-address');
const tCity            = document.getElementById('tenant-city');
const tCountry         = document.getElementById('tenant-country');

async function loadTenants() {
  const { tenants } = await api('/super/tenants');
  const tbody = document.querySelector('#tenants-table tbody');
  tbody.innerHTML = '';
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
    tbody.appendChild(tr);
  });

  // Edit
  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const tenant = tenants.find(x => x.id == id);
      tIdInput.value      = tenant.id;
      tName.value         = tenant.name;
      tEmail.value        = tenant.email;
      tPhone.value        = tenant.phone;
      tAddress.value      = tenant.address;
      tCity.value         = tenant.city;
      tCountry.value      = tenant.country;
      saveTenantBtn.textContent = 'Update Tenant';
      cancelTenantBtn.style.display = 'inline-block';
    });
  });

  // Delete
  tbody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this tenant?')) return;
      await api(`/tenants/tenants/${btn.dataset.id}`, { method: 'DELETE' });
      loadTenants();
    });
  });
}

cancelTenantBtn.addEventListener('click', () => {
  tenantForm.reset();
  tIdInput.value = '';
  saveTenantBtn.textContent = 'Save Tenant';
  cancelTenantBtn.style.display = 'none';
});

tenantForm.addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    name:    tName.value.trim(),
    email:   tEmail.value.trim(),
    phone:   tPhone.value.trim(),
    address: tAddress.value.trim(),
    city:    tCity.value.trim(),
    country: tCountry.value.trim()
  };
  if (tIdInput.value) {
    await api(`/tenants/tenants/${tIdInput.value}`, { method: 'PATCH', body: payload });
  } else {
    await api('/tenants/tenants', { method: 'POST', body: payload });
  }
  tenantForm.reset();
  tIdInput.value = '';
  saveTenantBtn.textContent = 'Save Tenant';
  cancelTenantBtn.style.display = 'none';
  loadTenants();
});

// Global Users
async function loadAllUsers() {
  const { users } = await api('/super/users');
  const tbody = document.querySelector('#all-users-table tbody');
  tbody.innerHTML = '';
  users.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>
        <select data-id="${u.id}" class="role-select">
          <option value="Customer">Customer</option>
          <option value="Manager">Manager</option>
          <option value="Admin">Admin</option>
        </select>
      </td>
      <td>${u.tenant_id}</td>
      <td>
        <button class="button-small btn-delete-user" data-id="${u.id}">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });

  // set role selects, handle changes
  tbody.querySelectorAll('.role-select').forEach(sel => {
    sel.value = users.find(u=>u.id==sel.dataset.id).role;
    sel.addEventListener('change', async () => {
      await api(`/user/users/${sel.dataset.id}`, { method: 'PATCH', body: { role: sel.value } });
      loadAllUsers();
    });
  });
  tbody.querySelectorAll('.btn-delete-user').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this user?')) return;
      await api(`/user/users/${btn.dataset.id}`, { method: 'DELETE' });
      loadAllUsers();
    });
  });
}

// All Bookings
async function loadAllBookings() {
  const { bookings } = await api('/super/bookings');
  const tbody = document.querySelector('#all-bookings-table tbody');
  tbody.innerHTML = '';
  bookings.forEach(b => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${b.id}</td>
      <td>${b.tenant_id}</td>
      <td>${b.car_id}</td>
      <td>${b.user_id}</td>
      <td>${b.start_date} → ${b.end_date}</td>
      <td>${b.status}</td>
      <td>${b.total_price}</td>`;
    tbody.appendChild(tr);
  });
}

// initial load
loadTenants();
loadAllUsers();
loadAllBookings();