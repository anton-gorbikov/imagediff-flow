'use strict';

let common = require('./common.js');

function updateClassNames(svg) {
	svg.selectAll('.step')
		.filter((d) => !d.isDecision && !d.isChance && !d.name)
		.remove();

	svg.selectAll('.step')
		.filter((d) => d.isDecision)
		.attr('class', 'decision');

	svg.selectAll('.step')
		.filter((d) => d.isChanceRoot)
		.attr('class', 'chanceRoot');

	svg.selectAll('.step')
		.filter((d) => d.isDecisionRoot)
		.attr('class', 'decisionRoot');

	svg.selectAll('.step')
		.filter((d) => d.isChance)
		.attr('class', 'chance');

	svg.selectAll('.step')
		.filter((d) => d.isActive)
		.classed('active', true);

	svg.selectAll('.active')
		.filter((d) => d.isRebased)
		.classed('rebased', true);

	svg.selectAll('.active:not(.rebased)')
		.filter((d) => d.isFailed)
		.classed('fail', true);
}

function createSvg(width, height) {
	const translation = 50;

	let svgElement = d3
		.select('#canvas')
		.append('svg');
	let svg = svgElement.append('g');
	let zoom = common.createZoomBehavior(svg, width, height);

	svgElement
		.call(zoom)
		.attr('width', width)
		.attr('height', height);

	d3.select(self.frameElement).style('height', `${height}px`);

	zoom.scale(1);
	zoom.translate([translation, translation]);
	zoom.event(svg);

	return svg;
}

function drawTree(svg, width, height, root) {
	const offset = 220;

	let cluster = d3.layout.cluster().size([height, width - offset]);
	let nodes = cluster.nodes(root);
	let links = cluster.links(nodes);
	let diagonal = d3.svg.diagonal().projection((d) => [d.y, d.x]);

	svg.selectAll('.link')
		.data(links)
		.enter()
		.append('path')
		.attr('class', 'link')
		.attr('d', diagonal);

	svg
		.selectAll('.link')
		.filter((d) => !d.target.isDecision && !d.target.isChance && !d.target.name)
		.remove();

	let node = svg.selectAll('.node')
		.data(nodes)
		.enter()
		.append('g')
		.attr('class', 'step')
		.attr('transform', (d) => `translate(${d.y},${d.x})`);

	return node;
}

function addLabels(node) {
	// Some calculations, hence disabling ESLint
	/* eslint-disable no-magic-numbers */
	let dy = window.chrome ? 6 : 22;

	node.append('text')
		.attr('dx', (d) => {
			let result = 15;

			if (d.isBranchRoot) {
				result = 8;
			} else if (d.children) {
				result = -15;
			}

			return result;
		})
		.attr('dy', function(d) {
			return d.isBranchRoot ? 22 : dy;
		})
		.attr('class', function(d) {
			let result = 'text endtext';

			if (d.isDecisionRoot) {
				result = 'text decisiontext';
			} else if (d.isChanceRoot) {
				result = 'text chancetext';
			} else if (d.children) {
				result = 'text steptext';
			}

			return result;
		})
		.attr('transform', function(d) {
			return d.children && !d.isBranchRoot ? 'rotate(330)' : 'rotate(0)';
		})
		.text((d) => d.name);
	/* eslint-enable no-magic-numbers */
}

function createD3Tree(root) {
	const nodeRadius = 8;

	let width = $(window).width();
	let height = $(window).height();
	let svg = createSvg(width, height);
	let node = drawTree(svg, width, height, root);

	updateClassNames(svg);
	common.createTooltip();
	node.append('circle').attr('r', nodeRadius);
	common.handleStepsHover(svg.selectAll('.step'));
	addLabels(node);
}

module.exports = createD3Tree;
