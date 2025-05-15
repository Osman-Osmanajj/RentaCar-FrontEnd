// JS/admin/dashboard.js
import { api } from '../api.js';

document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  location.href = '../index.html';
};

;(async () => {
  // STATS
  const [cars, bookings, users] = await Promise.all([
    api('/car/all'),
    api('/booking/all'),    // you may need to create this endpoint
    api('/users')
  ]);
  document.getElementById('stats').innerHTML = `
    <p>Cars: ${cars.length}</p>
    <p>Bookings: ${bookings.length}</p>
    <p>Users: ${users.length}</p>`;

  // CAR LIST
  const carList = document.getElementById('carList');
  carList.innerHTML = cars.map(c =>
    `<div class="admin-car">
       ${c.make} ${c.model} (${c.status})
       <button data-id="${c.id}" class="editCar">Edit</button>
       <button data-id="${c.id}" class="delCar">Delete</button>
     </div>`
  ).join('');

  // USER LIST
  const userList = document.getElementById('userList');
  userList.innerHTML = users.map(u =>
    `<div class="admin-user">
       ${u.name} (${u.role})
       <button data-id="${u.id}" class="delUser">Delete</button>
     </div>`
  ).join('');
})();
