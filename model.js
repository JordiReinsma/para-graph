// model.js
// Requisita e armazena os dados do site
// em formato de um grafo

// Inicia-se vazio
const STORAGE = {};

// Adiciona grafo ao model e o renderiza
function updateModel(word, data) {
	const graph = createGraph(word, data);
	STORAGE[word] = graph;
	renderGraph(graph);
}

// Proxy usado para possibilitar http request
const PROXY = 'https://cors-anywhere.herokuapp.com/';
// Site alvo da extração de informação
const SERVICE = 'https://dicionariocriativo.com.br/sinonimos-e-antonimos/';

// Acessa site com a palavra pesquisada
function fetchData(word) {
	const xhr = new XMLHttpRequest();
	xhr.responseType = 'document';
	const url = PROXY + SERVICE + word.replace(' ', '_');
	xhr.open('GET', url);
  // Em caso de sucesso, atualiza o model
	xhr.onload = (event) => {
		const data = scrape(event);
		updateModel(word, data);
	};
	xhr.send();
}

// Caso a palavra pesquisada se encontra no model,
// já o renderiza. Caso contrário, primeiro pesquisa
// a palavra no site alvo e salva ao model para futuros acessos
function setModel(word) {
	let graph = STORAGE[word];

	if (!graph) {
		fetchData(word);
	} else { 
		renderGraph(graph);
	}
}


