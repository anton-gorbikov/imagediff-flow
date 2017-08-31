[![npm version](https://badge.fury.io/js/imagediff-flow.svg)](https://badge.fury.io/js/imagediff-flow)
[![Build Status](https://travis-ci.org/anton-gorbikov/imagediff-flow.svg?branch=master)](https://travis-ci.org/anton-gorbikov/imagediff-flow)

# imagediff-flow
UI for image diff test automation. This project is based on the [Huddle/PhantomFlow](https://github.com/Huddle/PhantomFlow) project. The intend of this fork is to remove all dependencies like [PhantomJS](http://github.com/ariya/phantomjs/), [CasperJS](http://github.com/n1k0/casperjs) and [PhantomCSS](http://github.com/Huddle/PhantomCSS) and be able to use UI with any technology stack.

## Installing
To add imagediff-flow into your project simply install it as a NPM dependency:
```shell
npm install imagediff-flow
```

## Runner sample
Here is the sample of code how to configurate and use imagediff-flow:
```javascript
const flow = require('imagediff-flow');

flow.init({
	testLists: ['test-suite-chrome.json', 'test-suite-edge.json'],
	root: 'test-results',
	originalsPath: '../visuals',
	diffsPath: 'diffs',
	resultsPath: 'screenshots'
}).report();
```

Please, take into account that `testLists`, `originalsPath`, `diffsPath`, `resultsPath` should be relative to root.

## Data contract
Currently imagediff-flow supports only linear test flow, so you are not able to have multiple children for any parent. This was intentional to support the basic [Nightwatch.js](http://nightwatchjs.org/) workflow. Here is the sample of JSON files which are supported by imagediff-flow:
```json
{
    "Module Name 1": [
        {
            "name": "Test Name 1",
            "failed": false
        },
        {
            "name": "Test Name 2",
            "failed": false
        }
    ],
    "Search Test": [
        {
            "name": "Login to application",
            "failed": false
        },
        {
            "name": "Search random query",
            "failed": false
        },
        {
            "name": "Validate results",
            "failed": true
        }
    ]
}
```

By default imagediff-flow will search for `png` images by joining root, path, module name and tests name. So here is the list of images for test `Validate results`:
```
# original
./visuals/Search Test/Validate results.png
# diff
./test-results/diffs/Search Test/Validate results.png
# latest
./test-results/screenshots/Search Test/Validate results.png
```

## Report
Assuming you runner file has name `runner.js` to get access to report you simply need to execute this script:
```shell
node runner.js
```
