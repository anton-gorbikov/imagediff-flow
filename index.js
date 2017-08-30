'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const Ok = 200;
const DefaultPort = 9001;

module.exports = {};

module.exports.init = (options) => {
	// TODO: Copy required files to the host project.

	// TODO: Validate that __dirname works for NPM package.
	function getPath(resourcePath) {
		return path.join(__dirname, options.root, resourcePath);
	}

	function getImage(request, response) {
		fs.readFile(getPath(request.query.fileName), (error, image) => {
			response.writeHead(Ok, {
				'Content-Type': 'image/png'
			});
			response.end(image, 'binary');
		});
	}

	function getData(request, response) {
		let result = {};

		options.testLists.map(getPath).forEach((testList) => {
			let data = JSON.parse(fs.readFileSync(testList));

			Object.keys(data).forEach((moduleName) => {
				let child = result[moduleName] = {};
				let testSuite = data[moduleName];

				testSuite.forEach((test, index, tests) => {
					let isLast = index === tests.length - 1;

					_.extend(child, {
						name: test.name,
						isBranchRoot: !isLast,
						isDecisionRoot: false,
						isChanceRoot: false,
						isActive: true,
						screenshot: getScreenshotData(moduleName, test),
						children: !isLast ? [{}] : null
					});
					child = child.children && child.children[0];
				});
			});
		});

		response.send(result);
	}

	function getScreenshotData(moduleName, test) {
		let result = {};

		addFilePath(result, 'original', `${options.originalsPath}/${moduleName}/${test.name}.png`);
		if (test.failed) {
			addFilePath(result, 'failure', `${options.diffsPath}/${moduleName}/${test.name}.png`);
		}
		addFilePath(result, 'latest', `${options.resultsPath}/${moduleName}/${test.name}.png`);

		return result;
	}

	function addFilePath(object, type, path) {
		try {
			fs.accessSync(getPath(path));
			object[type] = path;
		} catch (e) {
			// Do nothing.
		}
	}

	return {
		report: () => {
			const app = express();

			app.use(express.static(path.join(__dirname, options.root)));
			app.get('/image', getImage);
			app.get('/data', getData);

			app.listen(DefaultPort, () => {
				console.log('http://localhost:9001');
			});
		}
	};
};
