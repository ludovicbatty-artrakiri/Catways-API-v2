document.getElementById('createReservationForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('createError');
  errorEl.textContent = '';

  const data = Object.fromEntries(new FormData(e.target));
  const catwayNumber = data.catwayNumber;
  delete data.catwayNumber;

  const res = await fetch(`/catways/${catwayNumber}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (res.ok) {
    location.reload();
  } else {
    const body = await res.json().catch(() => ({}));
    errorEl.textContent = body.message || 'Erreur lors de la création de la réservation';
  }
});

document.querySelectorAll('.deleteBtn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const row = btn.closest('tr');
    const catwayNumber = row.dataset.catway;
    const id = row.dataset.id;
    if (!confirm('Supprimer cette réservation ?')) return;
    const res = await fetch(`/catways/${catwayNumber}/reservations/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) row.remove();
    else alert('Erreur lors de la suppression');
  });
});
