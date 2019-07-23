// view.js
// Visualização do modelo extraído do site
// Apresentado como uma relação de sinônimos

const messageBox = document.querySelector('#messageBox');

// Adiciona rótulo no vértice se for uma palavra
function createLabel(d, i) {
    if (i % 2 == 0) {
        return '';
    }
    const id = d.node.id;
    if (isNaN(id)) {
        return id;
    }
    return '';
}

// Desenha o grafo no svg da pagina
function renderGraph(graph) {
    d3.select('#viz *').remove();
    messageBox.innerText = '';

    // Palavra não existe na base de dados
    if (graph.nodes.length === 1) {
        messageBox.innerText = `Palavra não encontrada: ${ graph.nodes[0].id }`;
        return; 
    }

    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Dados do grafo

    const label = {
        'nodes': [],
        'links': []
    };

    graph.nodes.forEach((d, i) => {
        label.nodes.push({node: d});
        label.nodes.push({node: d});
        label.links.push({
            source: i * 2,
            target: i * 2 + 1
        });
    });

    // Layout

    const graphLayout = d3.forceSimulation(graph.nodes)
        .force('charge', d3.forceManyBody().strength(-3000))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('x', d3.forceX(width / 2).strength(1))
        .force('y', d3.forceY(height / 2).strength(1))
        .force('link', d3.forceLink(graph.links).id((d) => d.id).distance(50).strength(1));

    const labelLayout = d3.forceSimulation(label.nodes)
        .force('charge', d3.forceManyBody().strength(-50))
        .force('link', d3.forceLink(label.links).distance(0).strength(2));

    // Visualização e inicialização

    const svg = d3
        .select('#viz')
        .attr('width', width)
        .attr('height', height);

    const container = svg.append('g');

    const link = container.append('g').attr('class', 'links')
        .selectAll('line')
        .data(graph.links)
        .enter()
        .append('line')
        .attr('stroke', '#fff')
        .attr('stroke-width', '1px');

    const labelNode = container.append('g').attr('class', 'labelNodes')
        .selectAll('text')
        .data(label.nodes)
        .enter()
        .append('text')
        .text(createLabel)
        .style('fill', '#222')
        .style('font-family', 'Arial')
        .style('font-size', (d, i) => i > 1 ? '12px' : '20px')
        .style('pointer-events', 'none'); // to prevent mouseover/drag capture

    const node = container.append('g').attr('class', 'nodes')
        .selectAll('g')
        .data(graph.nodes)
        .enter()
        .append('circle')
        .attr('r', (d, i) => isNaN(d.id) && i > 0 ? 6 : 12)
        .attr('fill', (d) => isNaN(d.id) ? '#111' : color(d.group));

    // Atualização

    function fixna(x) {
        if (isFinite(x)) return x;
        return 0;
    }

    function updateNode(node) {
        node.attr('transform', (d) => {
            return `translate(${ fixna(d.x) },${ fixna(d.y) })`;
        });
    }

    function updateLink(link) {
        link.attr('x1', (d) => fixna(d.source.x))
            .attr('y1', (d) => fixna(d.source.y))
            .attr('x2', (d) => fixna(d.target.x))
            .attr('y2', (d) => fixna(d.target.y));
    }

    function ticked() {
        node.call(updateNode);
        link.call(updateLink);

        labelLayout.alphaTarget(0.3).restart();
        labelNode.each(function(d, i) {
            if(i % 2 == 0) {
                d.x = d.node.x;
                d.y = d.node.y;
            } else {
                d.x = d.node.x;
                d.y = d.node.y + (d.index > 1 ? 16 : 28);
            }
        });
        labelNode.call(updateNode);

    }

    // Tentativa fracassada de poder clicar nas palavras
    
    // function clicked() {
    //     word = d3.select(this).innerText;
    //     console.log(word);
    // }

    graphLayout.on('tick', ticked);
    // labelNode.on('click', clicked);

    svg.call(
        d3.zoom()
            .scaleExtent([.5, 4])
            .on('zoom', () => container.attr('transform', d3.event.transform))
    );
}