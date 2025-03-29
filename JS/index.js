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


document.addEventListener("DOMContentLoaded", function () {
    function showError(input, message) {
        console.log(`Show of error for: ${input.name || input.type}, Mesazhi: ${message}`);
    
        let errorElement = input.nextElementSibling;
    
        if (errorElement && errorElement.classList.contains("error-message")) {
            errorElement.textContent = message;
        } else {
            errorElement = document.createElement("div");
            errorElement.className = "error-message";
            errorElement.style.color = "red";
            errorElement.style.fontSize = "14px";
            input.parentNode.insertBefore(errorElement, input.nextSibling);
            errorElement.textContent = message;
        }
    }
    

    function clearErrors(form) {
        form.querySelectorAll(".error-message").forEach((el) => el.remove());
    }

    function validateEmail(email) {
        return validator.isEmail(email);
    }

    function validatePassword(password) {
        return (
            validator.isLength(password, { min: 8 }) &&
            /[a-zA-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[!@#$%^&*.,]/.test(password)
        );
    }

    function validateConfirmPassword(password, confirmPassword) {
        return password === confirmPassword;
    }

    document.querySelector("#login-form form").addEventListener("submit", function (event) {
        event.preventDefault();
        clearErrors(this);

        const usernameInput = this.querySelector('input[type="text"]');
        const passwordInput = this.querySelector('input[type="password"]');
        let isValid = true;

        if (usernameInput.value.trim() === "") {
            showError(usernameInput, "Username is required.");
            isValid = false;
        }
        if (!validatePassword(passwordInput.value)) {
            showError(passwordInput, "Password must be at least 8 characters long and contain letters, numbers, and special characters.");
        
        }

        if (isValid) this.submit();
    });

    document.querySelector("#register-form form").addEventListener("submit", function (event) {
        event.preventDefault();
        clearErrors(this);

        const usernameInput = this.querySelector('input[type="text"]');
        const emailInput = this.querySelector('input[type="email"]');
        const passwordInput = this.querySelectorAll('input[type="password"]')[0];
        const confirmPasswordInput = this.querySelectorAll('input[type="password"]')[1];
        let isValid = true;

        if (usernameInput.value.trim() === "") {
            showError(usernameInput, "Username is required.");
            isValid = false;
        }
        if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, "Please enter a valid email ending in .com.");
            isValid = false;
        }
        console.log(validateEmail(emailInput.value.trim()));
        if (!validatePassword(passwordInput.value)) {
            showError(passwordInput, "Password must be at least 8 characters long and contain letters, numbers, and special characters.");
            isValid = false;
        }
        if (!validateConfirmPassword(passwordInput.value, confirmPasswordInput.value)) {
            showError(confirmPasswordInput, "Passwords do not match.");
            isValid = false;
        }

        if (isValid) this.submit();
    });

    document.querySelector("#forgot-password-form form").addEventListener("submit", function (event) {
        event.preventDefault();
        clearErrors(this);

        const emailInput = this.querySelector('input[type="email"]');
        const otpInput = this.querySelector("#OTP-code");
        let isValid = true;

        if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, "Please enter a valid email ending in .com.");
            isValid = false;
        }
        if (otpInput.value.trim() === "") {
            showError(otpInput, "OTP code is required.");
            isValid = false;
        }

        if (isValid) alert("OTP Verified Successfully!");
    });
});

