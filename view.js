function fixna(x) {
    if (isFinite(x)) return x;
    return 0;
}

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

function renderGraph(graph) {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Dados

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

    // Visualisation

    d3.select('#viz *').remove();

    const svg = d3
        .select('#viz')
        .attr('width', width)
        .attr('height', height);

    const container = svg.append('g');

    const node = container.append('g').attr('class', 'nodes')
        .selectAll('g')
        .data(graph.nodes)
        .enter()
        .append('circle')
        .attr('r', (d, i) => isNaN(d.id) && i > 0 ? 5 : 10)
        .attr('fill', (d) => isNaN(d.id) ? '#555' : color(d.group));

    const link = container.append('g').attr('class', 'links')
        .selectAll('line')
        .data(graph.links)
        .enter()
        .append('line')
        .attr('stroke', '#aaa')
        .attr('stroke-width', '1px');

    const labelNode = container.append('g').attr('class', 'labelNodes')
        .selectAll('text')
        .data(label.nodes)
        .enter()
        .append('text')
        .text(createLabel)
        .style('fill', '#333')
        .style('font-family', 'Arial')
        .style('font-size', (d, i) => i > 1 ? '12px' : '18px')
        .style('pointer-events', 'none'); // to prevent mouseover/drag capture

    //

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
                const b = this.getBBox();

                const diffX = d.x - d.node.x;
                const diffY = d.y - d.node.y;

                const dist = Math.sqrt(diffX * diffX + diffY * diffY);

                let shiftX = b.width * (diffX - dist) / (dist * 2);
                shiftX = Math.max(-b.width, Math.min(0, shiftX));
                const shiftY = 5;
                this.setAttribute('transform', 'translate(' + shiftX + ',' + shiftY + ')');
            }
        });
        labelNode.call(updateNode);

    }

    graphLayout.on('tick', ticked);

    // Initialização

    svg.call(
        d3.zoom()
            .scaleExtent([.1, 4])
            .on('zoom', () => container.attr('transform', d3.event.transform))
    );
}