  document.getElementById('logoutBtn').addEventListener('click', () => {
  fetch('http://localhost:3000/api/auth/logout', { 
    method: 'POST',
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
  .then(data => {
    console.log('Logout successful:', data);
    window.location.href = '../Index.html'; 
  })
  .catch(err => {
    console.error('Logout failed:', err);
  });
});