// mybookings.js
const grid = document.getElementById('bookingsGrid');
const modal = document.getElementById('editModal');
const modalpayment = document.getElementById('payModal');
const closeModalBtn = document.getElementById('closeModal');
const closeModalPaymentBtn = document.getElementById('closeModalPayment');
const editForm = document.getElementById('editBookingForm');
let bookings = [];
let editingBooking = null;

// ----------- API CALLS (adjust endpoints as needed) -----------
async function api(endpoint, method = 'GET', body) {
  const token = localStorage.getItem('token');
  const tenantId = localStorage.getItem('tenant_id');
  const res = await fetch('http://localhost:3000/api' + endpoint, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(tenantId ? { 'X-Tenant-ID': tenantId } : {}),   // <-- THIS LINE!
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) throw new Error((await res.json()).message || "API error");
  return res.json();
}



async function fetchBookings() {
  try {
    // Fetch only this user's bookings
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error("You must be logged in");
    // Example endpoint, adjust as needed
    const bookings = await api(`/booking/my/${userId}`);
    console.log(bookings);
    return bookings;


  } catch (e) {
    grid.innerHTML = `<p class="error">${e.message}</p>`;
    return [];
  }
}

// ----------- RENDER BOOKINGS -----------
function renderBookings(list) {
  grid.innerHTML = '';
  if (!list.length) {
    grid.innerHTML = '<p>No bookings found.</p>';
    return;
  }
  list.forEach(bk => {
    const card = document.createElement('div');
    card.className = 'booking-card';
    const imgUrl = bk.CarImages[0]?.image_url || 'https://i.pravatar.cc/150?u=randomuser';

    // status coloring
    let statusClass = 'status';
    if (bk.status === 'Pending') statusClass += 'pending';
    else if (bk.status === 'Completed') statusClass += ' completed';
    else if (bk.status === 'Cancelled') statusClass += ' cancelled';

    card.innerHTML = `
      <img src="${imgUrl}" class="car-img" alt="Car Image">
      <div class="booking-info">
        <h2>${bk.Car?.make || ''} ${bk.Car?.model || ''}</h2>
        <div class="dates">
          <i class="fas fa-calendar-alt"></i> 
          ${formatDate(bk.start_date)} – ${formatDate(bk.end_date)}
        </div>
        <div class="${statusClass}">
          <i class="fas fa-info-circle"></i> ${bk.status}
        </div>
        <div class="booking-actions">
            <button class="action-btn edit-btn">Edit</button>
            <button class="action-btn cancel-btn">Cancel</button>
            ${bk.status === 'Pending' ? `<button class="action-btn pay-btn">Pay</button>` : ''}
        </div>
      </div>
    `;
    // Add actions
    if (bk.status ){
      card.querySelector('.edit-btn').onclick = () => openEditModal(bk);
      card.querySelector('.cancel-btn').onclick = () => cancelBooking(bk);
      const payBtn = card.querySelector('.pay-btn');
      if (payBtn) payBtn.onclick = () => payForBooking(bk);
    }
    grid.appendChild(card);
  });
}

function formatDate(dt) {
  const d = new Date(dt);
  if (isNaN(d)) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// ----------- MODAL HANDLING -----------
function openEditModal(booking) {
  editingBooking = booking;
  modal.classList.remove('hidden');
  editForm.pickupDate.value = booking.start_date.split('T')[0];
  editForm.dropoffDate.value = booking.end_date.split('T')[0];
}
closeModalBtn.onclick = () => { modal.classList.add('hidden'); editingBooking = null; };
window.onclick = function(event) {
  if (event.target === modal) {
    modal.classList.add('hidden');
    editingBooking = null;
  }
}
closeModalPaymentBtn.onclick = () => { modalpayment.classList.add('hidden'); };
window.onclick = function(event) {
  if (event.target === modal) {
    modalpayment.classList.add('hidden');
  }
}

// ----------- FORM SUBMIT -----------
editForm.onsubmit = async function(e) {
  e.preventDefault();
  if (!editingBooking) return;
  const newStart = editForm.pickupDate.value;
  const newEnd = editForm.dropoffDate.value;
  if (!newStart || !newEnd) return;
  try {
    await api(`/booking/${editingBooking.id}`, 'PATCH ', {
      start_date: newStart, end_date: newEnd
    });
    modal.classList.add('hidden');
    // Reload bookings
    loadBookings();
  } catch (e) {
    alert("Failed to update booking: " + e.message);
  }
};

// ----------- CANCEL BOOKING -----------
async function cancelBooking(bk) {
  if (!confirm("Are you sure you want to cancel this booking?")) return;
  try {
    await api(`/booking/${bk.id}`, 'DELETE');
    loadBookings();
  } catch (e) {
    alert("Failed to cancel: " + e.message);
  }
}

async function payForBooking(bk) {
  // Simulate payment – in a real app, integrate a payment API!
 
  modalpayment.classList.remove('hidden');
  document.getElementById('amount').innerText = bk.total_price;

paymentform.onsubmit = async function(e) {
  e.preventDefault();
  const amount = bk.total_price;
  const payment_method = paymentform.paymentMethod.value;
  if (!amount || !payment_method) return;
  try {
    await api(`/payment/create/${bk.id}`, 'POST', {
      amount,
      payment_method
    });
    modalpayment.classList.add('hidden');
    alert("Payment successful!"); 
    ;
    

    // Reload bookings
    loadBookings();
  } catch (e) {
    alert("Failed to pay payment " + e.message);
  }
};
}

// ----------- PAY FOR BOOKING -----------




// ----------- LOAD EVERYTHING -----------
async function loadBookings() {
  bookings = await fetchBookings();
  renderBookings(bookings);

}
loadBookings();
