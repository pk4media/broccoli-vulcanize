# broccoli-vulcanize
[![Build Status](https://travis-ci.org/mbykovskyy/broccoli-vulcanize.svg?branch=master)](https://travis-ci.org/mbykovskyy/broccoli-vulcanize)

[Broccoli][broccoli] plugin for [Polymer vulcanize][polymer-vulcanize] tool.

## Install

```bash
npm install --save-dev broccoli-vulcanize
```

## Usage

```js
var vulcanize = require('broccoli-vulcanize');
var inputTree = 'public';
var options = {
  input: 'index.html',
  output: 'output/vulcanized.html',
  crisper: true,
  excludes: [/^data:/, /^http[s]?:/, /^\//],
  abspath: '/webroot/',
  stripExcludes: false,
  stripComments: false,
  inlineScripts: false,
  inlineCss: false,
  implicitStrip: false,
  outputHandler: function(filename, data) {
    // An output handler function to call rather than writing the processing result to file
  }
};

module.exports = vulcanize(inputTree, options);
```

See [polymer vulcanize][polymer-vulcanize] for details on `options`.

[broccoli]: https://github.com/broccolijs/broccoli "Broccoli"
[polymer-vulcanize]: https://github.com/Polymer/vulcanize  "Polymer vulcanize"
