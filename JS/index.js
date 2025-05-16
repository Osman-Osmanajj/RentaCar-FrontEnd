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

document
  .getElementById('login-form-element')
  .addEventListener('submit', async e => {
    e.preventDefault();

    try {
      const email    = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.message || 'Login failed');
        return;
      }

      const result = await response.json();

      // Optional: persist some info in localStorage
      setTenant(result.user.tenant_id);
      localStorage.setItem('userId', result.user.id);
      localStorage.setItem('token', result.accessToken); // optional — cookie already stores it securely

     
        if (result.user.role === 'Manager') {
        alert('Welcome Manager');
        window.location.href = './Pages/admin/dashboard.html';

        } else if (result.user.role === 'Customer') {
        alert('Welcome Customer');
        window.location.href = './Pages/home.html'; 
        }
        else if (result.user.role === 'Admin') {
            alert('wolcome admin!!')
        window.location.href = './Pages/SuperAdmin/dashboard.html';
        }
        else{
            alert('Unknown role');
            return;
        }

    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong during login.');
    }
  });
