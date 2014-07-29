'use strict';
var assert = require('assert');
var vulcanize = require('..');
var Broccoli = require('broccoli');
var path = require('path');
var fs = require('fs');
var builder;

afterEach(function() {
  if (builder) {
    builder.cleanup();
  }
});

it('should vulcanize components', function() {
  var tree = vulcanize('fixtures/index.html');
  builder = new Broccoli.Builder(tree);

  return builder.build().then(function(result) {
    var indexHtml = path.join(result.directory, 'index.html');
    assert(fs.existsSync(indexHtml));
  });
});

it('should not change options', function() {
  var options = {};
  var tree = vulcanize('fixtures/index.html', options);
  builder = new Broccoli.Builder(tree);

  return builder.build().then(function() {
    assert.deepEqual({}, options);
  });
});

it('should break component into html and js when CSP is enabled', function() {
  var tree = vulcanize('fixtures/index.html', {
    csp: true
  });
  builder = new Broccoli.Builder(tree);

  return builder.build().then(function(result) {
    var indexHtml = path.join(result.directory, 'index.html');
    assert(fs.existsSync(indexHtml));

    var indexJs = path.join(result.directory, 'index.js');
    assert(fs.existsSync(indexJs));
  });
});

it('should rename vulcanized component', function() {
  var outputFilePath = 'vulcanized/vulcanized.html';
  var options = {
    output: outputFilePath
  };
  var tree = vulcanize('fixtures/index.html', options);
  builder = new Broccoli.Builder(tree);

  return builder.build().then(function(result) {
    var indexHtml = path.join(result.directory, outputFilePath);
    assert(fs.existsSync(indexHtml));
  });
});

it('should be able to call vulcanize repeatedly', function() {
  var tree = vulcanize('fixtures/index.html');
  builder = new Broccoli.Builder(tree);

  return builder.build().then(function(result) {
    var indexHtml = path.join(result.directory, 'index.html');
    assert(fs.existsSync(indexHtml));

    return builder.build().then(function(result) {
      var indexHtml = path.join(result.directory, 'index.html');
      assert(fs.existsSync(indexHtml));
    });
  });
});
