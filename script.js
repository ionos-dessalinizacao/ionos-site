// Elementos
const menuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

// Toggle menu
menuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Fecha menu ao clicar
mobileMenu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    mobileMenu.classList.add('hidden');
  }
});