// La page est déjà protégée côté serveur (middleware authenticateView).
// Ce script charge uniquement les réservations en cours via un appel asynchrone à l'API.
(async () => {
  try {
    const res = await fetch('/api/reservations/current', { credentials: 'include' });
    const reservations = await res.json();

    const tbody = document.getElementById('reservationsBody');
    tbody.innerHTML = '';

    if (!reservations.length) {
      tbody.innerHTML = '<tr><td colspan="5">Aucune réservation en cours</td></tr>';
      return;
    }

    reservations.forEach((r) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.catwayNumber}</td>
        <td>${r.clientName}</td>
        <td>${r.boatName}</td>
        <td>${new Date(r.startDate).toLocaleDateString('fr-FR')}</td>
        <td>${new Date(r.endDate).toLocaleDateString('fr-FR')}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    document.getElementById('reservationsBody').innerHTML =
      '<tr><td colspan="5">Erreur lors du chargement des réservations</td></tr>';
  }
})();
