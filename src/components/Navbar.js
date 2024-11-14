export default function Navbar() {
  const navbar = document.createElement('nav');
  navbar.classList.add('bg-blue-500', 'text-white', 'p-4', 'flex', 'items-center', 'justify-between');

  navbar.innerHTML = `
    <div class="flex items-center">
      <img src="./src/images/logo.jpeg" alt="Logo" class="h-16 w-16 rounded-full"> 
    </div>
    <div class="flex space-x-4"> <!-- Menu à droite -->
      <a href="#Patient" class="hover:underline">Patients</a>
      <a href="#Medecin" class="hover:underline">Médecins</a>
      <a href="#RendezVous" class="hover:underline">Rendez-vous</a>
    </div>
  `;

  return navbar;
}
