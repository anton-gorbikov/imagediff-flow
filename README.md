# imagediff-flow
UI for image diff test automation. This project is based on the [Huddle/PhantomFlow](https://github.com/Huddle/PhantomFlow) project. The intend of this fork is to remove all dependencies like [PhantomJS](http://github.com/ariya/phantomjs/), [CasperJS](http://github.com/n1k0/casperjs) and [PhantomCSS](http://github.com/Huddle/PhantomCSS) and be able to use UI with any technology stack.

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

Please, take into account that `originalsPath`, `diffsPath`, `resultsPath` should be relative to root.
