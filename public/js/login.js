document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('loginError');
  errorEl.textContent = '';

  const data = Object.fromEntries(new FormData(e.target));

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      errorEl.textContent = body.message || 'Identifiants invalides';
      return;
    }

    window.location.href = '/dashboard';
  } catch (err) {
    errorEl.textContent = 'Erreur de connexion au serveur';
  }
});
