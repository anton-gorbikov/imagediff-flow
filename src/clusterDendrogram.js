'use strict';

let common = require('./common.js');

function updateSteps(svg) {
	let steps = svg.selectAll('.step');

	applyClass(steps, 'isDecision', 'decision');
	applyClass(steps, 'isChanceRoot', 'chanceRoot');
	applyClass(steps, 'isDecisionRoot', 'decisionRoot');
	applyClass(steps, 'isChance', 'chance');
	applyClass(steps, 'isActive', 'active');
	applyClass(svg.selectAll('.active'), 'isFailed', 'fail');

	handleStepsHover(steps);
}

function drawPaths(svg, cluster, root, diagonal) {
	const angle = 90;
	const nodeRadius = 6;

	let nodes = cluster.nodes(root);

	svg.selectAll('path.link')
		.data(cluster.links(nodes))
		.enter()
		.append('path')
		.attr('class', 'link-subtle')
		.attr('d', diagonal);

	svg.selectAll('g.node')
		.data(nodes)
		.enter()
		.append('g')
		.attr('class', 'step')
		.attr('transform', (d) => `rotate(${d.x - angle})translate(${d.y})`)
		.append('circle')
		.attr('r', nodeRadius);
}

function getDiagonal() {
	const angle = 180;

	let diagonal = d3.svg.diagonal.radial()
		.projection(function(d) {
			return [d.y, d.x / angle * Math.PI];
		});

	return diagonal;
}

function handleStepsHover(steps) {
	steps
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
}

function createD3ClusterDendrogram(root) {
	var width = $(window).width();
	var height = $(window).height();
	var radius = Math.min(width, height) / 1.8;

	var cluster = d3.layout.cluster()
		.size([360, radius]);

	let svgElement = d3
		.select('#canvas')
		.append('svg');
	let svg = svgElement.append('g');
	let zoom = common.createZoomBehavior(svg, width, height);

	svgElement
		.call(zoom)
		.attr('width', width)
		.attr('height', height);

	drawPaths(svg, cluster, root, getDiagonal());
	common.createTooltip();
	updateSteps(svg);

	var rootTests = getLeafInfo(root);
	var groups = getGroupInfo(rootTests);

	groupPie(radius, svg, groups);
	rootPie(radius, svg, rootTests);

	zoom.scale(0.75);
	zoom.translate([width / 2, height / 2]);
	zoom.event(svg);
}

function getGroupInfo(array) {
	var tots = {};
	var newArray = [];

	array.forEach(function(item) {
		var stem = item.name.split(/\/|\\/).shift();

		if (tots[stem] !== void 0) {
			tots[stem] += item.value;
		} else {
			tots[stem] = 0;
		}
	});

	Object.keys(tots).forEach((key) => {
		newArray.push({
			value: tots[key],
			name: key
		});
	});

	return newArray;
}

function groupPie(radius, svg, data) {
	const groupPieOffset = 46;

	let color = d3.scale
		.ordinal()
		.range(['#DEDDDA', '#D6D6D2', '#BFBFBB', '#CCCBC8', '#C2C1BE']);
	let g = pie('group-pie', radius + groupPieOffset, color, svg, data);

	pieTooltip(g);
}

function rootPie(radius, svg, data) {
	const rootPieOffset = 8;
	var color = d3.scale
		.ordinal()
		.range(['#CCD2E3', '#D5E1ED', '#CBD4D6', '#D5EDEC', '#CCE3DB']);

	var g = pie('root-pie', radius + rootPieOffset, color, svg, data);

	pieTooltip(g);

	g.on('click', function(e) {
		window.location.hash = e.data.name;
	});
}

function pie(name, radius, color, svg, data) {
	const from = 8;
	const to = 40;

	var arc = d3.svg.arc()
		.innerRadius(radius + from)
		.outerRadius(radius + to);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {
			return d.value;
		});

	var g = svg.selectAll(`.arc${name}`)
		.data(pie(data))
		.enter()
		.append('g')
		.attr('class', 'arc');

	g.append('path')
		.attr('d', arc)
		.style('fill', function(d) {
			return color(d.data.name);
		});

	g.classed(name, true);

	return g;
}

function pieTooltip(g) {
	let { tooltip, text } = common.createTooltip('tooltip-label');

	g
		.on('mouseover', function(e) {
			if (tooltip.style('visibility') === 'hidden') {
				text.text(e.data.name);
			}

			return tooltip.style('visibility', 'visible');
		})
		.on('mousemove', () => mousemove(tooltip))
		.on('mouseout', () => tooltip.style('visibility', 'hidden'));
}

function mousemove(tooltip) {
	const cursorOffset = 10;
	var width = Number(tooltip.style('width').replace('px', ''));
	var height = Number(tooltip.style('height').replace('px', ''));
	var right = d3.event.pageX + cursorOffset + width;
	var top = d3.event.pageY - cursorOffset + height;

	function positionHorizontaly() {
		if (right > document.body.clientWidth) {
			right = d3.event.pageX - cursorOffset - width;
		} else {
			right = d3.event.pageX + cursorOffset;
		}
	}

	function positionVerticaly() {
		if (top > document.body.clientHeight) {
			top = d3.event.pageY - cursorOffset - height;
		} else {
			top = d3.event.pageY - cursorOffset;
		}
	}

	positionHorizontaly();
	positionVerticaly();

	return tooltip.style('top', `${top}px`).style('left', `${right}px`);
}

function getLeafInfo(obj) {
	var roots = [];

	function recurse(obj, root, isRoot) {
		if (obj.children) {
			for (let i = 0; i < obj.children.length; i++) {
				let newRootRef = null;

				if (isRoot) {
					newRootRef = {
						name: obj.children[i].name,
						value: 0,
						deep: 0
					};
					roots.push(newRootRef);
				}
				recurse(obj.children[i], newRootRef || root, false);
			}
		} else {
			root.value += 1;
		}
	}

	recurse(obj, {}, true);

	return roots;
}

function applyClass(steps, prop, className) {
	steps.filter(function(d) {
		return d[prop];
	}).classed(className, true);
}

module.exports = createD3ClusterDendrogram;
