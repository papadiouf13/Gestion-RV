export default function PopupForm(fields, onSubmit) {
  const overlay = document.createElement('div');
  overlay.classList.add('fixed', 'inset-0', 'bg-gray-800', 'bg-opacity-50', 'flex', 'justify-center', 'items-center');

  const form = document.createElement('form');
  form.classList.add('bg-white', 'p-6', 'rounded', 'space-y-4', 'w-1/3');

  form.innerHTML = fields
    .map((field) => {
      if (field.type === 'select') {
        return `
          <div>
            <select name="${field.name}" class="w-full p-2 border rounded">
              <option value="">${field.placeholder}</option>
              ${field.options
                .map(
                  (option) => `<option value="${option.value}" ${option.value == field.value ? 'selected' : ''}>${option.label}</option>`
                )
                .join('')}
            </select>
            <p class="text-red-500 text-sm hidden" id="${field.name}-error">Ce champ est obligatoire</p>
          </div>`;
      } else {
        return `
          <div>
            <input type="${field.type}" name="${field.name}" placeholder="${field.placeholder}" value="${field.value || ''}" class="w-full p-2 border rounded"/>
            <p class="text-red-500 text-sm hidden" id="${field.name}-error">Ce champ est obligatoire</p>
          </div>`;
      }
    })
    .join('') + `<button type="submit" class="w-full bg-blue-500 text-white py-2 rounded">Ajouter</button>`;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    const formData = new FormData(form);
    const data = {};

    fields.forEach((field) => {
      const value = formData.get(field.name);
      const errorElement = document.getElementById(`${field.name}-error`);
      if (!value) {
        errorElement.classList.remove('hidden');
        isValid = false;
      } else {
        errorElement.classList.add('hidden');
      }
      data[field.name] = value;
    });

    if (isValid) {
      onSubmit(data);
      overlay.remove();
    }
  });

  overlay.appendChild(form);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);
}
