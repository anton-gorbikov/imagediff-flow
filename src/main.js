'use strict';

window.$ = window.jQuery = require('jquery');
window._ = require('lodash');
window.d3 = require('d3');
require('chosen-js');
require('bootstrap');
require('../node_modules/jasny-bootstrap/dist/js/jasny-bootstrap.min');

let createD3Tree = require('./flowTree');
let createD3ClusterDendrogram = require('./clusterDendrogram');

getDataAndAppendDropdown();
initialiseSideBar();

function initialiseSideBar() {
	let rebaseBtn = $('#rebase');
	let rebaseSuccessBtn = $('#rebase-success');

	$('.navmenu').offcanvas({
		autohide: false
	});

	$('body').on('screenshot', function(e) {
		updateSideBar(e);

		if (e.latest) {
			rebaseBtn.data({
				moduleName: e.moduleName,
				testName: e.name,
				svgElement: e.element
			});
			if (e.element.classList.contains('fail')) {
				rebaseSuccessBtn.hide();
				rebaseBtn.show();
			} else {
				rebaseSuccessBtn.show();
			}
		} else {
			rebaseBtn.hide();
			rebaseSuccessBtn.hide();
		}
	});

	$(window).on('hashchange', function() {
		updateSideBar({});
	});

	rebaseBtn.click(function(event) {
		let { moduleName, testName, svgElement } = rebaseBtn.data();

		$.get('rebase', { moduleName, testName }, function() {
			rebaseBtn.hide();
			rebaseSuccessBtn.show();
			svgElement.classList.remove('fail');
		});

		event.preventDefault();
	});
}

function updateSideBar(e) {
	$('#vis_name').text(e.name || '');
	toggleSideBarImages(e, 'latest');
	toggleSideBarImages(e, 'original');
	toggleSideBarImages(e, 'diff');
}

function toggleSideBarImages(e, prop) {
	var a = $(`#${prop}`);
	var img = $(`#${prop} img`);

	if (e[prop]) {
		a.show();
		a.attr('href', `/image?fileName=${e[prop]}`);
		img.attr('src', `/image?fileName=${e[prop]}`);
	} else {
		a.hide();
		a.attr('href', '');
		img.attr('src', '');
	}
}

function getDataAndAppendDropdown() {
	$.getJSON('data', function(json) {
		var dropdown = $('<select id="dropdown">');

		dropdown.append('<option value="default" selected>View all</option>');

		Object.keys(json)
			.map((key) => key.replace(/"/g, ''))
			.forEach((key) => dropdown.append(`<option value="${key}">${key}</option>`));

		dropdown.on('change', () => {
			let val = dropdown.val();

			if (val !== 'default') {
				window.location.hash = val;
			} else {
				window.location.hash = '';
			}
		});

		$('#dropdown-container').append(dropdown);

		$(dropdown).chosen();

		processHash(json);

		$(window).on('hashchange', function() {
			processHash(json);
		});
	});
}

function processHash(data) {
	let hash = window.location.hash.slice(1);
	let dropdown = $('#dropdown');

	$('svg,.tooltip,.tooltip-label').remove();

	dropdown.val(hash || 'default');
	dropdown.trigger('chosen:updated');

	if (hash) {
		createD3Tree($.extend(true, {}, data[hash]), {
			root: '/'
		});
	} else {
		doDefault(data);
	}
}

function doDefault(data) {
	var combined = {
		name: 'FilesApp',
		isBranchRoot: true,
		isDecisionRoot: true,
		children: []
	};

	_.forEach(data, function(value, key) {
		combined.children.push(value);
		value.groupName = key;
	});

	createD3ClusterDendrogram($.extend(true, {}, combined), {
		root: '/'
	});
}
