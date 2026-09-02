document.getElementById('createUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('createError');
  errorEl.textContent = '';
  const data = Object.fromEntries(new FormData(e.target));

  const res = await fetch('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (res.ok) {
    location.reload();
  } else {
    const body = await res.json().catch(() => ({}));
    errorEl.textContent = body.message || "Erreur lors de la création de l'utilisateur";
  }
});

document.querySelectorAll('.deleteBtn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const row = btn.closest('tr');
    const email = row.dataset.email;
    if (!confirm(`Supprimer l'utilisateur ${email} ?`)) return;
    const res = await fetch(`/users/${email}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) row.remove();
    else alert('Erreur lors de la suppression');
  });
});
