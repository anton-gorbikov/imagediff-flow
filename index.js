const express = require('express');
const fs = require('fs');
const path = require('path');

module.exports = {};

module.exports.init = (options) => {
	// TODO: Copy required files to the host project.

	// TODO: Validate that __dirname works for NPM package.
	function getPath(resourcePath) {
		return path.join(__dirname, options.root, resourcePath);
	}

	function getImage(request, response) {

	}

	function getData(request, response) {
		let result = {};

		options.testLists.map(getPath).forEach(function(testList) {
			let data = JSON.parse(fs.readFileSync(testList));
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
