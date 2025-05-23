const BASE_URL = 'http://localhost:3000/api/user';

async function api(endpoint, method = 'GET', body) {
  const token    = localStorage.getItem('token');
  const tenantId = localStorage.getItem('tenant_id');
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token    ? { Authorization: `Bearer ${token}` } : {}),
      ...(tenantId ? { 'X-Tenant-ID': tenantId } : {})
    },
    credentials: 'include'
  };
  if (body) opts.body = JSON.stringify(body);
  return fetch(`${BASE_URL}${endpoint}`, opts);
}

document.addEventListener('DOMContentLoaded', async () => {
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

  const nameInput       = document.getElementById('name');
  const emailInput      = document.getElementById('email');
  const oldPwdInput     = document.getElementById('oldpassword');
  const newPwdInput     = document.getElementById('newPassword');
  const confirmPwdInput = document.getElementById('confirmPassword');
  const form            = document.getElementById('settingsForm');

  const resp = await api(`/users/${userId}`, 'GET');
  if (!resp.ok) {
    alert('Could not load profile. Please log in again.');
    return window.location.href = 'login.html';
  }

  const { user } = await resp.json();
  nameInput.value  = user.name;
  emailInput.value = user.email;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const oldPassword = oldPwdInput.value.trim();
    const newPassword = newPwdInput.value.trim();
    const confirmPassword = confirmPwdInput.value.trim();

    // Validations
    if (!name || !email) {
      return alert('Name and email are required.');
    }

    if (!validator.isEmail(email)) {
      return alert('Please enter a valid email address.');
    }

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        return alert('New passwords do not match.');
      }

      if (!oldPassword) {
        return alert('Please enter your current password.');
      }

      if (!validator.isStrongPassword(newPassword, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })) {
        return alert('New password must be at least 8 characters long and include uppercase, lowercase, number, and symbol.');
      }
    }

    const updateData = { name, email };
    if (oldPassword && newPassword) {
      updateData.oldpassword = oldPassword;
      updateData.newPassword = newPassword;
    }

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
    alert(result.message || 'Profile updated successfully.');
    oldPwdInput.value = newPwdInput.value = confirmPwdInput.value = '';
  });
});
