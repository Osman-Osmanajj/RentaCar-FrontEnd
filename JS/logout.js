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

    localStorage.removeItem('token');
    localStorage.removeItem('userId')
    localStorage.removeItem('tenant')
    window.location.href = '../Index.html'; 
  })
  .catch(err => {
    console.error('Logout failed:', err);
    localStorage.removeItem('token');
    window.location.href = '../Index.html';
  });
});
