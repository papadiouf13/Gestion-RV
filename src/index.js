// src/index.js
import Navbar from './components/Navbar.js';
import PatientPage from './pages/Patient.js';
import MedecinPage from './pages/Medecin.js';
import RendezVousPage from './pages/RendezVous.js';

function renderPage(page) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(Navbar());

  switch (page) {
    case 'Patient':
      app.appendChild(PatientPage());
      break;
    case 'Medecin':
      app.appendChild(MedecinPage());
      break;
    case 'RendezVous':
      app.appendChild(RendezVousPage());
      break;
    default:
      app.appendChild(PatientPage());
      break;
  }
}

window.addEventListener('hashchange', () => {
  renderPage(location.hash.slice(1));
});

renderPage('Patient');
