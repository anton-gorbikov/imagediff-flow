'use strict';

const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

const StatusOk = 200;
const DefaultPort = 9001;

module.exports = {};

module.exports.init = (options) => {
	fs.copySync(path.join(__dirname, 'dist'), options.root);

	function getPath(resourcePath) {
		return path.resolve(options.root, resourcePath);
	}

	function getImage(request, response) {
		fs.readFile(getPath(request.query.fileName), (error, image) => {
			response.writeHead(StatusOk, {
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
						moduleName: moduleName,
						name: test.name,
						isActive: true,
						isBranchRoot: !isLast,
						isChanceRoot: false,
						isDecisionRoot: false,
						isFailed: test.failed,
						isRebased: !!test.rebased,
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

	function rebaseImage(request, response) {
		let { moduleName, testName } = request.query;
		let original = `${options.originalsPath}/${moduleName}/${testName}.png`;
		let latest = `${options.resultsPath}/${moduleName}/${testName}.png`;

		fs.createReadStream(getPath(latest))
			.pipe(fs.createWriteStream(getPath(original)));

		updateRebaseStatus(moduleName, testName);

		response.send('');
	}

	function updateRebaseStatus(moduleName, testName) {
		options.testLists.map(getPath).forEach((testList) => {
			let data = JSON.parse(fs.readFileSync(testList));

			if (data.hasOwnProperty(moduleName)) {
				data[moduleName].forEach((test) => {
					if (test.name === testName) {
						test.rebased = true;
						fs.writeFileSync(testList, JSON.stringify(data));
					}
				});
			}
		});
	}

	return {
		report: () => {
			const app = express();

			app.use(express.static(options.root));
			app.get('/image', getImage);
			app.get('/data', getData);
			app.get('/rebase', rebaseImage);

			app.listen(DefaultPort, () => {
				console.log(`http://localhost:${DefaultPort}`);
			});
		}
	};
};
