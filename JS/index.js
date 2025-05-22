function show(el) { el.style.display = 'block'; }
function hide(el) { el.style.display = 'none'; }

const loginContainer    = document.getElementById('login-form');
const registerContainer = document.getElementById('register-form');
const forgotContainer   = document.getElementById('forgot-password-form');

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

document.getElementById('login-form-element').addEventListener('submit', async e => {
  e.preventDefault();

  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    alert('Email and password are required!');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || 'Login failed');
      return;
    }

    localStorage.setItem('userId', result.user.id);
    localStorage.setItem('token', result.accessToken);
    localStorage.setItem('tenant_id', result.user.tenant_id);

    if (result.user.role === 'Manager') {
      alert('Welcome Manager');
      window.location.href = './Pages/admin/dashboard.html';
    } else if (result.user.role === 'Customer') {
      alert('Welcome Customer');
      window.location.href = './Pages/home.html';
    } else if (result.user.role === 'Admin') {
      alert('Welcome Admin!');
      window.location.href = './Pages/SuperAdmin/dashboard.html';
    } else {
      alert('Unknown role');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Something went wrong during login.');
  }
});

document.getElementById('register-form-element').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name            = document.getElementById('register-name').value.trim();
  const email           = document.getElementById('register-email').value.trim();
  const password        = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  if (!name || !email || !password || !confirmPassword) {
    alert("All fields are required!");
    return;
  }
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/user/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const result = await response.json();
    if (response.ok) {
      alert("User registered successfully! Please login.");
      hide(registerContainer);
      show(loginContainer);
    } else {
      alert(result.message || "Error registering user.");
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Something went wrong during registration.');
  }
});
