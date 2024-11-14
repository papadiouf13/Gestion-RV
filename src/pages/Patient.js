import PopupForm from "../components/PopupForm.js";

export default function PatientPage() {
  const container = document.createElement("div");
  container.classList.add("mt-4");

  const title = document.createElement("h2");
  title.classList.add("text-2xl", "font-bold", "mb-4");
  title.innerText = "Liste des Patients";

  const addButton = document.createElement("button");
  addButton.classList.add(
    "bg-blue-500",
    "text-white",
    "p-2",
    "rounded",
    "mb-4"
  );
  addButton.innerText = "Ajouter un Patient";

  addButton.addEventListener("click", () => {
    PopupForm(
      [
        { name: "nom", type: "text", placeholder: "Nom" },
        { name: "prenom", type: "text", placeholder: "Prénom" },
        { name: "age", type: "number", placeholder: "Âge" },
        { name: "adresse", type: "text", placeholder: "Adresse" },
      ],
      (data) => {
        fetch("http://localhost:3000/Patient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then(() => loadPatients());
      }
    );
  });

  const tableContainer = document.createElement("div");
  tableContainer.classList.add("relative", "overflow-x-auto");

  const table = document.createElement("table");
  table.classList.add(
    "w-full",
    "text-sm",
    "text-left",
    "text-gray-500",
    "dark:text-gray-400"
  );

  const tableHeader = `
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="px-6 py-3">Nom</th>
        <th scope="col" class="px-6 py-3">Prénom</th>
        <th scope="col" class="px-6 py-3">Âge</th>
        <th scope="col" class="px-6 py-3">Adresse</th>
        <th scope="col" class="px-6 py-3">Actions</th>
      </tr>
    </thead>`;
  table.innerHTML = tableHeader;

  const tableBody = document.createElement("tbody");
  table.appendChild(tableBody);
  tableContainer.appendChild(table);

  function loadPatients() {
    fetch("http://localhost:3000/Patient")
      .then((response) => response.json())
      .then((patients) => {
        tableBody.innerHTML = patients
          .map(
            (patient) => `
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${patient.nom}</td>
              <td class="px-6 py-4">${patient.prenom}</td>
              <td class="px-6 py-4">${patient.age}</td>
              <td class="px-6 py-4">${patient.adresse}</td>
              <td class="px-6 py-4">
                <button class="edit-btn text-blue-500 hover:text-blue-700" data-id="${patient.id}">
                  <i class="fas fa-edit"></i>
                </button>
              </td>
            </tr>`
          )
          .join("");

        // Ajouter les écouteurs d'événements sur les boutons d'édition après avoir rechargé la table
        document.querySelectorAll(".edit-btn").forEach((button) => {
          button.addEventListener("click", (e) => {
            const patientId = e.target.closest(".edit-btn").getAttribute("data-id");
            editPatient(patientId);
          });
        });
      });
  }

  function editPatient(id) {
    fetch(`http://localhost:3000/Patient/${id}`)
      .then((res) => res.json())
      .then((patient) => {
        PopupForm(
          [
            { name: 'nom', type: 'text', placeholder: 'Nom', value: patient.nom },
            { name: 'prenom', type: 'text', placeholder: 'Prénom', value: patient.prenom },
            { name: 'age', type: 'number', placeholder: 'Âge', value: patient.age },
            { name: 'adresse', type: 'text', placeholder: 'Adresse', value: patient.adresse }
          ],
          (data) => {
            fetch(`http://localhost:3000/Patient/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            }).then(() => loadPatients());
          }
        );
      });
  }

  container.appendChild(title);
  container.appendChild(addButton);
  container.appendChild(tableContainer);

  loadPatients();
  return container;
}
