import PopupForm from '../components/PopupForm.js';

export default function MedecinPage() {
  const container = document.createElement('div');
  container.classList.add('mt-4');

  const title = document.createElement('h2');
  title.classList.add('text-2xl', 'font-bold', 'mb-4');
  title.innerText = 'Liste des Médecins';

  const addButton = document.createElement('button');
  addButton.classList.add('bg-blue-500', 'text-white', 'p-2', 'rounded', 'mb-4');
  addButton.innerText = 'Ajouter un Médecin';

  addButton.addEventListener('click', () => {
    PopupForm(
      [
        { name: 'nom', type: 'text', placeholder: 'Nom' },
        { name: 'specialite', type: 'text', placeholder: 'Spécialité' },
        { name: 'telephone', type: 'text', placeholder: 'Téléphone' },
      ],
      (data) => {
        fetch('http://localhost:3000/Medecin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(() => loadMedecins());
      }
    );
  });

  const tableContainer = document.createElement('div');
  tableContainer.classList.add('relative', 'overflow-x-auto');

  const table = document.createElement('table');
  table.classList.add('w-full', 'text-sm', 'text-left', 'text-gray-500', 'dark:text-gray-400');

  const tableHeader = `
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="px-6 py-3">Nom</th>
        <th scope="col" class="px-6 py-3">Spécialité</th>
        <th scope="col" class="px-6 py-3">Téléphone</th>
      </tr>
    </thead>`;
  table.innerHTML = tableHeader;

  const tableBody = document.createElement('tbody');
  table.appendChild(tableBody);
  tableContainer.appendChild(table);

  function loadMedecins() {
    fetch('http://localhost:3000/Medecin')
      .then((response) => response.json())
      .then((medecins) => {
        tableBody.innerHTML = medecins
          .map(
            (medecin) => `
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${medecin.nom}</td>
              <td class="px-6 py-4">${medecin.specialite}</td>
              <td class="px-6 py-4">${medecin.telephone}</td>
            </tr>`
          )
          .join('');
      });
  }

  container.appendChild(title);
  container.appendChild(addButton);
  container.appendChild(tableContainer);

  loadMedecins();
  return container;
}
