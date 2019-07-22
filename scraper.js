const PROXY = 'https://cors-anywhere.herokuapp.com/';
const SERVICE = 'https://dicionariocriativo.com.br/sinonimos-e-antonimos/';

function extract(text) {
	text = text.split('Ant:')[0];	
	const [ group, csv ] = text.split('.');
	const words = trimArray(csv.split(','));
	return { group, words };	
}

function scrape(event) {
	const data = [];

	const doc = event.target.response;
	if (doc instanceof Document) {
		const items = doc.querySelectorAll('ul#contentList .contentListData');

		items.forEach(item => {			
			data.push(extract(item.innerText));
		});
	}

	return data;
}

