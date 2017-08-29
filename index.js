const express = require('express');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

module.exports = {};

module.exports.init = (options) => {
	// TODO: Copy required files to the host project.

	// TODO: Validate that __dirname works for NPM package.
	function getPath(resourcePath) {
		return path.join(__dirname, options.root, resourcePath);
	}

	function getImage(request, response) {
		fs.readFile(getPath(request.query.fileName), (error, image) => {
			response.writeHead(200, {
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

				testSuite.forEach((testName, index, tests) => {
					let isLast = index !== tests.length - 1;

					_.extend(child, {
						name: testName,
						isBranchRoot: !isLast,
						isDecisionRoot: false,
						isChanceRoot: false,
						isActive: true,
						screenshot: {
							original: `${options.originalsPath}/${moduleName}/${testName}.png`,
							failure: `${options.diffsPath}/${moduleName}/${testName}.png`,
							latest: `${options.resultsPath}/${moduleName}/${testName}.png`
						},
						children: !isLast ? [{}] : null
					});
					child = child.children && child.children[0];
				});
			})
		});

		response.send(result);
	}

	return {
		report: () => {
			const app = express();

			app.use(express.static(path.join(__dirname, options.root)));
			app.get('/image', getImage);
			app.get('/data', getData);

			app.listen(9001, () => {
				console.log('http://localhost:9001');
			});
		}
	};
};
