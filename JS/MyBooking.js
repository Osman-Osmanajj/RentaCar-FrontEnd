function confirmBooking() {
    const message = document.getElementById("confirmation-message");
    message.textContent = "✅ Booking Confirmed!";
    message.style.display = "block";
    message.classList.add("fade-in");
}
