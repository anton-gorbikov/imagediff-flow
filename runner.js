'use strict';

const flow = require('./index.js');

flow.init({
	testLists: ['screenshots/test-flow-2ft.json', 'screenshots/test-flow-10ft.json'],
	root: 'dist',
	originalsPath: '../visuals',
	diffsPath: '../diff',
	resultsPath: 'screenshots'
}).report();
