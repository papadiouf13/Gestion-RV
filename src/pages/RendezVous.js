import PopupForm from '../components/PopupForm.js';

export default function RendezVousPage() {
  const container = document.createElement('div');
  container.classList.add('mt-4');

  const title = document.createElement('h2');
  title.classList.add('text-2xl', 'font-bold', 'mb-4');
  title.innerText = 'Liste des Rendez-vous';

  const addButton = document.createElement('button');
  addButton.classList.add('bg-blue-500', 'text-white', 'p-2', 'rounded', 'mb-4');
  addButton.innerText = 'Ajouter un Rendez-vous';

  addButton.addEventListener('click', () => {
    loadPatientsAndMedecins().then(({ patients, medecins }) => {
      const patientOptions = patients.map(patient => ({ 
        value: patient.id, 
        label: `${patient.nom} ${patient.prenom}` 
      }));
      const medecinOptions = medecins.map(medecin => ({ 
        value: medecin.id, 
        label: `${medecin.nom} (${medecin.specialite})` 
      }));

      PopupForm(
        [
          { name: 'patientId', type: 'select', options: patientOptions, placeholder: 'Sélectionner un Patient' },
          { name: 'medecinId', type: 'select', options: medecinOptions, placeholder: 'Sélectionner un Médecin' },
          { name: 'date', type: 'date', placeholder: 'Date' },
          { name: 'heure', type: 'time', placeholder: 'Heure' }
        ],
        (data) => {
          fetch('http://localhost:3000/RendezVous', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }).then(() => loadRendezVous());
        }
      );
    });
  });

  const tableContainer = document.createElement('div');
  tableContainer.classList.add('relative', 'overflow-x-auto');

  const table = document.createElement('table');
  table.classList.add('w-full', 'text-sm', 'text-left', 'text-gray-500', 'dark:text-gray-400');

  const tableHeader = `
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="px-6 py-3">Patient</th>
        <th scope="col" class="px-6 py-3">Médecin</th>
        <th scope="col" class="px-6 py-3">Spécialité</th>
        <th scope="col" class="px-6 py-3">Date</th>
        <th scope="col" class="px-6 py-3">Heure</th>
        <th scope="col" class="px-6 py-3">Actions</th>
      </tr>
    </thead>`;
  
  table.innerHTML = tableHeader;
  const tableBody = document.createElement('tbody');
  table.appendChild(tableBody);
  tableContainer.appendChild(table);

  function loadRendezVous() {
    Promise.all([
      fetch('http://localhost:3000/RendezVous').then((res) => res.json()),
      fetch('http://localhost:3000/Patient').then((res) => res.json()),
      fetch('http://localhost:3000/Medecin').then((res) => res.json())
    ]).then(([rendezVous, patients, medecins]) => {
      const patientsMap = Object.fromEntries(patients.map(patient => [patient.id, patient]));
      const medecinsMap = Object.fromEntries(medecins.map(medecin => [medecin.id, medecin]));

      tableBody.innerHTML = rendezVous.map(rdv => {
        const patient = patientsMap[rdv.patientId] || { nom: 'Inconnu', prenom: '' };
        const medecin = medecinsMap[rdv.medecinId] || { nom: 'Inconnu', specialite: 'Inconnue' };

        return `
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${patient.nom} ${patient.prenom}</td>
            <td class="px-6 py-4">${medecin.nom}</td>
            <td class="px-6 py-4">${medecin.specialite}</td>
            <td class="px-6 py-4">${rdv.date}</td>
            <td class="px-6 py-4">${rdv.heure}</td>
            <td class="px-6 py-4 flex space-x-2">
              <button class="edit-btn text-blue-500 hover:text-blue-700" data-id="${rdv.id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="delete-btn text-red-500 hover:text-red-700" data-id="${rdv.id}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>`;
      }).join('');

      document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
          const rdvId = e.target.closest('.edit-btn').getAttribute('data-id');
          editRendezVous(rdvId);
        });
      });

      document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
          const rdvId = e.target.closest('.delete-btn').getAttribute('data-id');
          deleteRendezVous(rdvId);
        });
      });
    });
  }

  function deleteRendezVous(id) {
    fetch(`http://localhost:3000/RendezVous/${id}`, {
      method: 'DELETE',
    }).then(() => loadRendezVous());
  }

  function editRendezVous(id) {
    Promise.all([
      fetch(`http://localhost:3000/RendezVous/${id}`).then(res => res.json()),
      loadPatientsAndMedecins()
    ]).then(([rdv, { patients, medecins }]) => {
      const patientOptions = patients.map(patient => ({ 
        value: patient.id, 
        label: `${patient.nom} ${patient.prenom}` 
      }));
      const medecinOptions = medecins.map(medecin => ({ 
        value: medecin.id, 
        label: `${medecin.nom} (${medecin.specialite})` 
      }));

      PopupForm(
        [
          { name: 'patientId', type: 'select', options: patientOptions, placeholder: 'Sélectionner un Patient', value: rdv.patientId },
          { name: 'medecinId', type: 'select', options: medecinOptions, placeholder: 'Sélectionner un Médecin', value: rdv.medecinId },
          { name: 'date', type: 'date', placeholder: 'Date', value: rdv.date },
          { name: 'heure', type: 'time', placeholder: 'Heure', value: rdv.heure }
        ],
        (data) => {
          fetch(`http://localhost:3000/RendezVous/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }).then(() => loadRendezVous());
        }
      );
    });
  }

  function loadPatientsAndMedecins() {
    return Promise.all([
      fetch('http://localhost:3000/Patient').then(res => res.json()),
      fetch('http://localhost:3000/Medecin').then(res => res.json())
    ]).then(([patients, medecins]) => ({ patients, medecins }));
  }

  container.appendChild(title);
  container.appendChild(addButton);
  container.appendChild(tableContainer);

  loadRendezVous();
  return container;
}
