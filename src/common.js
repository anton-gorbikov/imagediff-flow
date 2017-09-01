'use strict';

function createTooltip() {
	let tooltip = d3.select('#canvas')
		.append('div')
		.attr('class', 'tooltip')
		.style('position', 'absolute')
		.style('z-index', '10')
		.style('visibility', 'hidden')
		.text('');

	tooltip.append('div');

	return tooltip;
}

function createZoomBehavior(svg, width, height) {
	const extentMin = 0.1;
	const extentMax = 2.5;

	let x = d3.scale
		.linear()
		.domain([0, width])
		.range([width, 0]);
	let y = d3.scale
		.linear()
		.domain([0, height])
		.range([height, 0]);

	let zoom = d3.behavior
		.zoom()
		.x(x)
		.y(y)
		.scaleExtent([extentMin, extentMax])
		.on('zoom', () => {
			var t = zoom.translate();

			svg.attr('transform', `translate(${t[0]},${t[1]}) scale( ${zoom.scale()})`);
		});

	return zoom;
}

module.exports = {
	createTooltip,
	createZoomBehavior
};
