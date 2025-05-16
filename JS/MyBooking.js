document.addEventListener('DOMContentLoaded', async () => {
      const params = new URLSearchParams(location.search);
      const carId    = params.get('carId');
      const tenantId = params.get('tenantId');
      const userId   = params.get('userId');

      const imageContainer = document.getElementById('carImageContainer');
      const infoContainer  = document.getElementById('carInfoContainer');
      const msgDiv         = document.getElementById('message');
      const form           = document.getElementById('bookingForm');

      if (!carId || !tenantId || !userId) {
        msgDiv.textContent = 'Missing carId, tenantId or userId in URL.';
        form.style.display = 'none';
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/api/car/${carId}`, {
          headers: { 'X-Tenant-ID': tenantId }
        });
        if (!res.ok) throw new Error(res.statusText);
        const car = await res.json();

        const imgUrl = (car.CarImages && car.CarImages[0]?.image_url)
          || 'https://via.placeholder.com/600x250?text=No+Image';
        imageContainer.innerHTML = `<img src="${imgUrl}" alt="${car.make} ${car.model}">`;

        infoContainer.innerHTML = `
          <h2>${car.make} ${car.model}</h2>
          <p><i class="fas fa-calendar-alt"></i> Year: ${car.year}</p>
          <p><i class="fas fa-id-card"></i> Plate: ${car.license_plate}</p>
          <p><i class="fas fa-flag"></i> Status: ${car.status}</p>
          <p><i class="fas fa-car"></i> Type: ${car.CarType?.name || 'N/A'}</p>
        `;
      } catch (err) {
        msgDiv.textContent = 'Failed to load car details.';
        form.style.display = 'none';
        console.error(err);
        return;
      }

      form.addEventListener('submit', async e => {
        e.preventDefault();
        msgDiv.textContent = '';

        const start_date = document.getElementById('startDate').value;
        const end_date   = document.getElementById('endDate').value;

        try {
          const res = await fetch(`http://localhost:3000/api/booking/create/${userId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Tenant-ID': tenantId
            },
            body: JSON.stringify({ 
              car_id: carId,
              start_date,
              end_date
            })
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.message || res.statusText);
          msgDiv.style.color = 'green';
          msgDiv.textContent = 'Booking confirmed!';
        } catch (err) {
          msgDiv.style.color = 'red';
          msgDiv.textContent = err.message || 'Booking failed.';
          console.error(err);
        }
      });
    });