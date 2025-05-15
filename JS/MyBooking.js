// JS/MyBooking.js
import { api } from './api.js';

const qs        = new URLSearchParams(location.search);
const carId     = qs.get('car');
const userId    = localStorage.getItem('userId');
const container = document.querySelector('.car-container');
const msg       = document.getElementById('confirmation-message');

function show(text, error=false){
  msg.textContent=text;
  msg.style.color=error?'red':'green';
  msg.style.display='block';
  msg.classList.add('fade-in');
}

(async()=>{
  try{
    const car = await api(`/car/${carId}`);
    container.innerHTML = `
      <img src="${car.default_image || '../Photo/placeholder.jpg'}" style="width:100%">
      <p><strong>${car.make} ${car.model}</strong></p>`;
  }catch(err){ show(err.message,true); }
})();

document.querySelector('.confirm-btn').onclick = async ()=>{
  try{
    await api(`/booking/create/${userId}`,{
      method:'POST',
      body:{
        car_id: carId,
        start_date: new Date().toISOString().slice(0,10),
        end_date:   new Date(Date.now()+86400000).toISOString().slice(0,10),
        total_price: 100
      }
    });
    show('✅ Booking confirmed!');
  }catch(err){ show(err.message,true); }
};
