// /JS/settings.js
const BASE_URL = 'http://localhost:3000/api/user';  // your correct mount

async function api(endpoint, method = 'GET', body) {
  const token    = localStorage.getItem('token');
  const tenantId = localStorage.getItem('tenant_id');
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token    ? { Authorization: `Bearer ${token}`    } : {}),
      ...(tenantId ? { 'X-Tenant-ID':   tenantId            } : {})
    },
    credentials: 'include'
  };
  if (body) opts.body = JSON.stringify(body);
  return fetch(`${BASE_URL}${endpoint}`, opts);
}

document.addEventListener('DOMContentLoaded', async () => {
  // logout handler
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      }).finally(() => {
        localStorage.clear();
        window.location.href = '../Index.html';
      });
    });
  }

  const userId = localStorage.getItem('userId');
  if (!userId) return window.location.href = 'login.html';

  // form elements
  const nameInput       = document.getElementById('name');
  const emailInput      = document.getElementById('email');
  const oldPwdInput     = document.getElementById('oldpassword');
  const newPwdInput     = document.getElementById('newPassword');
  const confirmPwdInput = document.getElementById('confirmPassword');
  const form            = document.getElementById('settingsForm');

  // load existing data
  const resp = await api(`/users/${userId}`, 'GET');
  if (!resp.ok) {
    alert('Could not load profile. Please log in again.');
    return window.location.href = 'login.html';
  }
  const { user } = await resp.json();
  nameInput.value  = user.name;
  emailInput.value = user.email;

  // handle submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // password logic
    if (newPwdInput.value || confirmPwdInput.value) {
      if (newPwdInput.value !== confirmPwdInput.value) {
        return alert('New passwords do not match.');
      }
      if (!oldPwdInput.value) {
        return alert('Please enter your current password.');
      }
    }

    // build update payload
    const updateData = { name: nameInput.value };
    if (oldPwdInput.value && newPwdInput.value) {
      updateData.oldpassword = oldPwdInput.value;
      updateData.newPassword = newPwdInput.value;
    }

    // send PATCH
    const updateResp = await api(`/users/${userId}`, 'PATCH', updateData);
    if (!updateResp.ok) {
      const text = await updateResp.text();
      let msg = `Update failed (${updateResp.status})`;
      try {
        msg += `: ${JSON.parse(text).message}`;
      } catch {
        msg += `: ${text.slice(0, 200)}`;
      }
      return alert(msg);
    }

    const result = await updateResp.json();
    alert(result.message);
    // clear pwd fields
    oldPwdInput.value = newPwdInput.value = confirmPwdInput.value = '';
  });
});
