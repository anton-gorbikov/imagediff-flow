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
		.filter((d) => d.isFailed)
		.classed('fail', true);
}

function createD3Tree(root) {
	var width = $(window).width();
	var height = $(window).height();
	var cluster = d3.layout.cluster().size([height, width - 220]);
	var diagonal = d3.svg.diagonal().projection((d) => [d.y, d.x]);

	var nodes = cluster.nodes(root);
	var links = cluster.links(nodes);

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

	svg.selectAll('.link')
		.data(links)
		.enter()
		.append('path')
		.attr('class', 'link')
		.attr('d', diagonal);

	svg.selectAll('.link').filter(function(d) {
		return !d.target.isDecision && !d.target.isChance && !d.target.name;
	}).remove();

	var node = svg.selectAll('.node')
		.data(nodes)
		.enter().append('g')
		.attr('class', 'step')
		.attr('transform', (d) => `translate(${d.y},${d.x})`);

	updateClassNames(svg);
	common.createTooltip();

	node.append('circle').attr('r', 8);

	svg.selectAll('.step')
		.filter(function(d) {
			if (d.screenshot && d.screenshot.original && d.screenshot.failure) {
				this.setAttribute('class', `${this.className.baseVal} screenshotFail`);
			}

			return !!d.screenshot;
		})
		.classed('screenshot', true)
		.on('mouseover', function(e) {
			$('body').trigger({
				type: 'screenshot',
				name: e.name,
				diff: e.screenshot.failure,
				latest: e.screenshot.latest,
				original: e.screenshot.original,
				element: this
			});
		});

	var dy = window.chrome ? 6 : 22;

	node.append('text')
		.attr('dx', (d) => {
			return d.isBranchRoot ? 8 : d.children ? -15 : 15;
		})
		.attr('dy', function(d) {
			return d.isBranchRoot ? 22 : dy;
		})
		.attr('class', function(d) {
			return d.isDecisionRoot ? 'text decisiontext' : d.isChanceRoot ? 'text chancetext' : d.children ? 'text steptext' : 'text endtext';
		})
		.attr('transform', function(d) {
			return d.children && !d.isBranchRoot ? 'rotate(330)' : 'rotate(0)';
		})
		.text((d) => d.name);

	zoom.scale(1);
	zoom.translate([50, 50]);
	zoom.event(svg);
}

module.exports = createD3Tree;
