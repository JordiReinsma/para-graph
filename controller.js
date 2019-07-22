const searchButton = document.querySelector('#searchButton');
const searchInput = document.querySelector('#searchInput');

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
