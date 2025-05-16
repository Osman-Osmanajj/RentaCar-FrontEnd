// JS/index.js
import { api, setTenant } from './api.js';

const loginContainer    = document.getElementById('login-form');
const registerContainer = document.getElementById('register-form');
const forgotContainer   = document.getElementById('forgot-password-form');

// show / hide helpers
function show(el) { el.style.display = 'block'; }
function hide(el) { el.style.display = 'none'; }

// ─── Tab toggles ─────────────────────────────────────
document.getElementById('show-register').addEventListener('click', e => {
  e.preventDefault();
  hide(loginContainer);
  show(registerContainer);
});

document.getElementById('show-login').addEventListener('click', e => {
  e.preventDefault();
  hide(registerContainer);
  show(loginContainer);
});

document.getElementById('show-forgot-password').addEventListener('click', e => {
  e.preventDefault();
  hide(loginContainer);
  show(forgotContainer);
});

document.getElementById('show-login-form-forgot').addEventListener('click', e => {
  e.preventDefault();
  hide(forgotContainer);
  show(loginContainer);
});

// ─── LOGIN ───────────────────────────────────────────
document
  .getElementById('login-form-element')
  .addEventListener('submit', async e => {
    e.preventDefault();

    try {

      const email    = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      
      const response = fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const result = await (await response).json();
      // persist tenant for all future calls
      setTenant(result.user.tenant_id);

      localStorage.setItem('userId', result.user.id);
      localStorage.setItem("token", result.accessToken)

      // redirect by role
      if (result.user.role === 'Customer') {
        window.location.href = 'Pages/home.html';
      } else {
        window.location.href = 'Pages/admin/dashboard.html';
      }
    }catch(error){
      console.error(error)
    }
  });

// ─── REGISTER ────────────────────────────────────────
document
  .getElementById('register-form-element')
  .addEventListener('submit', async e => {
    e.preventDefault();

    const name     = document.getElementById('reg-username').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const pw       = document.getElementById('reg-password').value;
    const pw2      = document.getElementById('reg-password2').value;

    if (pw !== pw2) {
      return alert('Passwords do not match');
    }

    try {
      await api('/user/users', {
        method: 'POST',
        body: {
          name,
          email,
          password:   pw,
          role:       'Customer',
          tenant_id:  1  // or let them choose
        }
      });

      alert('Account created! Please log in.');
      hide(registerContainer);
      show(loginContainer);
    } catch (err) {
      alert(err.message+"test2");
    }
  });
