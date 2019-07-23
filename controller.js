// controller.js
// Controlador do serviço, gerencia
// a busca do usuário pela palavra,
// requisitando do model, que depois
// este invoca a renderização da view

const searchButton = document.querySelector('#searchButton');
const searchInput = document.querySelector('#searchInput');

// Usuário fez uma pesquisa, envia a palavra pro model
function search() {
	const word = searchInput.value;
	setModel(word);
}

searchButton.onclick = search;

searchInput.addEventListener('keyup', (event) => {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    event.preventDefault();
    search();
  }
});
