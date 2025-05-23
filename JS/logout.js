// /JS/logout.js
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;
  logoutBtn.addEventListener('click', () => {
    fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.ok ? res.json() : Promise.reject(res.status))
    .finally(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('tenant');
      window.location.href = '../Index.html';
    });
  });
});
