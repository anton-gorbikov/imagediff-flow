'use strict';

window.$ = window.jQuery = require('jquery');
window._ = require('lodash');
window.d3 = require('d3');
require('chosen-js');
require('bootstrap');
require('../node_modules/jasny-bootstrap/dist/js/jasny-bootstrap.min');
require('./flowTree');
require('./clusterDendrogram');

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
				latest: e.latest,
				original: e.original,
				svgElement: e.element
			});
			if (e.element.className.baseVal.indexOf('screenshotFail') !== -1) {
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

	rebaseBtn.click(function() {
		let { original, latest, svgElement } = rebaseBtn.data();

		$.get('rebase', { original, latest }, function() {
			rebaseBtn.hide();
			rebaseSuccessBtn.show();
			svgElement.className.baseVal = svgElement.className.baseVal.replace('screenshotFail', '');
		});
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

		_.forEach(json, function(value, key) {
			key = key.replace(/"/g, '');
			dropdown.append('<option value="' + key + '">' + key.replace('.json', '') + '</option>');
		});

		dropdown.on('change', function(a, v) {
			var val = dropdown.val();
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
	var hash = window.location.hash.slice(1);
	var searchTerm;
	var found;
	var combined;
	var promises = [];

	$('svg,.tooltip,.tooltip-label').remove();

	$(dropdown).val(hash || 'default');
	$(dropdown).trigger("chosen:updated");

	if (hash && hash.indexOf('?') !== -1) {

		searchTerm = hash.split('?')[1];

	} else if (hash) {

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
		value.name = key;
	});

	createD3ClusterDendrogram($.extend(true, {}, combined), {
		root: '/'
	});
}
