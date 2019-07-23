// scraper.js
// Funções usadas pelo model para coletar os dados
// das palavras do site "Dicionário Criativo"

// Remove blank space das palavras
function trimArray(arr) {
	return arr.map(s => s.trim());
}

// Extrai as palavras "polidas" dos dados brutos do site
// Encontram-se na forma
// "3. feliz, alegre, contenteAnt: triste, infeliz"
function extract(text) {
  // Remove palavras antônimas
	text = text.split('Ant:')[0];
  // Separa os sinônimos em grupos semânticos
	const [ group, csv ] = text.split('.');
  // Separa cada palavra pela vírgula entre elas
	const words = trimArray(csv.split(','));
	return { group, words };	
}

// Faz query na lista dos sinônimos de uma palavra
function scrape(event) {
	const data = [];

	const doc = event.target.response;
	if (doc instanceof Document) {
		const items = doc.querySelectorAll('ul#contentList .contentListData');
  
    // Pesquisar uma palavra que não existe no dicionario
    // retorna uma lista vazia
		items.forEach(item => {			
			data.push(extract(item.innerText));
		});
	}

	return data;
}

