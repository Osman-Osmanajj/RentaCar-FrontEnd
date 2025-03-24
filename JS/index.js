document.getElementById('show-register').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

document.getElementById('show-forgot-password').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('forgot-password-form').style.display = 'block';
});

document.getElementById('show-login-form-forgot').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('forgot-password-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

// Custom validation functions using validator.js
function validateEmail(email) {
    return validator.isEmail(email);
}

function validatePassword(password) {
    return validator.isLength(password, { min: 8 });
}

function validateConfirmPassword(password, confirmPassword) {
    return password === confirmPassword;
}

document.getElementById('submit-forgot-password').addEventListener('click', function(event) {
    event.preventDefault();
    const emailField = document.querySelector('#forgot-password-form input[type="email"]');
    if (emailField.value.trim() === '' || !validateEmail(emailField.value)) {
        alert('Please enter a valid email address.');
    } else {
        document.getElementById('OTP-code').style.display = 'block';
    }
});

document.querySelector('#login-form form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.querySelector('#login-form input[type="text"]').value;
    const password = document.querySelector('#login-form input[type="password"]').value;
    if (username.trim() === '' || password.trim() === '') {
        alert('Username and password are required.');
    } else {

    }
});

document.querySelector('#register-form form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.querySelector('#register-form input[type="text"]').value;
    const email = document.querySelector('#register-form input[type="email"]').value;
    const password = document.querySelector('#register-form input[type="password"]').value;
    const confirmPassword = document.querySelector('#register-form input[type="password"]:nth-child(4)').value;
    if (username.trim() === '' || email.trim() === '' || !validateEmail(email) || password.trim() === '' || !validatePassword(password) || !validateConfirmPassword(password, confirmPassword)) {
        alert('Please fill out all fields correctly.');
    } else {
        
    }
});

document.querySelector('#forgot-password-form form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.querySelector('#forgot-password-form input[type="email"]').value;
    const otp = document.querySelector('#OTP-code').value;
    if (email.trim() === '' || !validateEmail(email) || otp.trim() === '') {
        alert('Please fill out all fields correctly.');
    } else {
        alert('OTP Verified Successfully!'); // You can change this to the appropriate logic
    }
});

