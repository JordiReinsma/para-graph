const STORAGE = {};

function updateModel(word, data) {
	const graph = createGraph(word, data);
	STORAGE[word] = graph;
	renderGraph(graph);
}

function fetchData(word) {
	const xhr = new XMLHttpRequest();
	xhr.responseType = 'document';
	const url = PROXY + SERVICE + word.replace(' ', '_');
	xhr.open('GET', url);
	xhr.onload = (event) => {
		const data = scrape(event);
		updateModel(word, data);
	};
	xhr.send();
}

function setModel(word) {
	let graph = STORAGE[word];

	if (!graph) {
		fetchData(word);
	} else { 
		renderGraph(graph);
	}
}


