function createGraph(key, data) {
	const nodes = [];
	const links = [];
	const unique = [];

	nodes.push({ id: key,  group: '0'});

	data.forEach(item => {

		nodes.push({ id: item.group,  group: item.group});
		links.push({ source: key,  target: item.group, value: 1});

		item.words.forEach(word => {
			if (word !== key) {
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