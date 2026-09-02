// La page est protégée côté serveur ; ce script gère uniquement les interactions CRUD.

document.getElementById('createCatwayForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('createError');
  errorEl.textContent = '';
  const data = Object.fromEntries(new FormData(e.target));
  data.catwayNumber = Number(data.catwayNumber);

  const res = await fetch('/catways', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (res.ok) {
    location.reload();
  } else {
    const body = await res.json().catch(() => ({}));
    errorEl.textContent = body.message || 'Erreur lors de la création du catway';
  }
});

document.querySelectorAll('.saveBtn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const row = btn.closest('tr');
    const id = row.dataset.id;
    const catwayState = row.querySelector('.stateInput').value;
    const res = await fetch(`/catways/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ catwayState }),
    });
    if (res.ok) alert('Catway mis à jour');
    else alert('Erreur lors de la mise à jour');
  });
});

document.querySelectorAll('.deleteBtn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const row = btn.closest('tr');
    const id = row.dataset.id;
    if (!confirm(`Supprimer le catway ${id} ?`)) return;
    const res = await fetch(`/catways/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) row.remove();
    else alert('Erreur lors de la suppression');
  });
});
