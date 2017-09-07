'use strict';

function createTooltip(className = 'tooltip') {
	let tooltip = d3.select('#canvas')
		.append('div')
		.attr('class', className)
		.style('position', 'absolute')
		.style('z-index', '10')
		.style('visibility', 'hidden')
		.text('');

	let text = tooltip.append('div');

	return { tooltip, text };
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

function handleStepsHover(steps) {
	steps
		.filter((d) => d.screenshot)
		.classed('screenshot', true)
		.on('mouseover', function(e) {
			$('body').trigger({
				type: 'screenshot',
				name: e.name,
				moduleName: e.moduleName,
				diff: e.isFailed ? e.screenshot.failure : '',
				latest: e.isFailed ? e.screenshot.latest : '',
				original: e.screenshot.original,
				element: this
			});
		});
}

module.exports = {
	createTooltip,
	createZoomBehavior,
	handleStepsHover
};
