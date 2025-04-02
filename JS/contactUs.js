// script.js
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting immediately

    let isValid = true;

    // Get form fields
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();

    // Get error elements
    let nameError = document.getElementById("nameError");
    let emailError = document.getElementById("emailError");
    let messageError = document.getElementById("messageError");
    let successMessage = document.getElementById("successMessage");

    // Reset previous errors
    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    successMessage.textContent = "";

    // Validate Name
    if (name === "") {
        nameError.textContent = "Name is required";
        isValid = false;
    }

    // Validate Email
    if (email === "") {
        emailError.textContent = "Email is required";
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        emailError.textContent = "Invalid email format";
        isValid = false;
    }

    // Validate Message
    if (message === "") {
        messageError.textContent = "Message cannot be empty";
        isValid = false;
    }

    // If valid, show success message
    if (isValid) {
        successMessage.textContent = "Your message has been sent successfully!";
        document.getElementById("contactForm").reset();
    }
});
