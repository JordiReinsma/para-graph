// graph.js
// Cria grafo de relações de sinônimos.
// Vértice no centro do grafo é a palavra pesquisada,
// que é ligada aos diversos significados da palavra,
// e estes vértices ligam-se aos sinônimos da palavra,
// para cada significado.

// Exemplo:
// feliz
// --> significado 1
// ----> contente
// ----> alegre
// --> significado 2
// ----> providencial
// ----> oportuno

function createGraph(key, data) {
	const nodes = [];
	const links = [];
	const unique = [];
  // Palavras que se repetem em vários significados
  // são conectadas a todos os significados
  
	nodes.push({ id: key,  group: '0'});

	data.forEach(item => {

		nodes.push({ id: item.group,  group: item.group});
		links.push({ source: key,  target: item.group, value: 10});

		item.words.forEach(word => {
      // Para não inserir a palavra chave repetidamente
			if (word !== key) {
        // Para não inserir sinônimos repetidos
				if (!unique.includes(word)) {
					nodes.push({ id: word,  group: item.group});
					unique.push(word);
				}
				links.push({ source: item.group,  target: word, value: 1});
			}
		});
	});

	return { nodes, links };
}