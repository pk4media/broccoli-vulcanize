'use strict';
var assert = require('assert');
var vulcanize = require('..');
var Broccoli = require('broccoli');
var path = require('path');
var fs = require('fs');
var sinon = require('sinon');
var builder;

afterEach(function() {
  if (builder) {
    builder.cleanup();
  }
});

it('should vulcanize components', function() {
  var tree = vulcanize('fixtures', {
    input: 'basic-index.html'
  });
  builder = new Broccoli.Builder(tree);

  return builder.build().then(function(result) {
    var indexHtml = path.join(result.directory, 'basic-index.html');
    assert(fs.existsSync(indexHtml));
  });
});

it('should vulcanize cyclic dependent components', function() {
  var tree = vulcanize('fixtures', {
    input: 'cyclic-dependency-index.html'
  });
  builder = new Broccoli.Builder(tree);

  return builder.build().then(function(result) {
    var indexHtml = path.join(result.directory, 'cyclic-dependency-index.html');
    assert(fs.existsSync(indexHtml));
  });
});

it('should not change options', function() {
  var options = {
    input: 'basic-index.html'
  };
  var tree = vulcanize('fixtures', options);
  builder = new Broccoli.Builder(tree);

  return builder.build().then(function() {
    assert.deepEqual({input: 'basic-index.html'}, options);
  });
});

it('should not be affected by options changing outside', function() {
  var options = {
    input: 'basic-index.html'
  };
  var tree = vulcanize('fixtures', options);
  options.output = 'should/not/affect/vulcanize.html';

  builder = new Broccoli.Builder(tree);

  return builder.build().then(function(result) {
    var indexHtml = path.join(result.directory, 'basic-index.html');
    assert(fs.existsSync(indexHtml));
  });
});

it('should rename vulcanized component', function() {
  var outputFilePath = 'vulcanized/vulcanized.html';
  var tree = vulcanize('fixtures', {
    input: 'basic-index.html',
    output: outputFilePath
  });
  builder = new Broccoli.Builder(tree);

  return builder.build().then(function(result) {
    var indexHtml = path.join(result.directory, outputFilePath);
    assert(fs.existsSync(indexHtml));
  });
});

it('should be able to call vulcanize repeatedly', function() {
  var tree = vulcanize('fixtures', {
    input: 'basic-index.html'
  });
  builder = new Broccoli.Builder(tree);

  return builder.build().then(function(result) {
    var indexHtml = path.join(result.directory, 'basic-index.html');
    assert(fs.existsSync(indexHtml));

    return builder.build().then(function(result) {
      var indexHtml = path.join(result.directory, 'basic-index.html');
      assert(fs.existsSync(indexHtml));
    });
  });
});

it('should accept a broccoli tree', function() {
  var tree = {
    read: function() {
      return 'fixtures';
    },
    cleanup: function() {
    }
  };

  tree = vulcanize(tree, {
    input: 'basic-index.html'
  });
  builder = new Broccoli.Builder(tree);

  return builder.build().then(function(result) {
    var indexHtml = path.join(result.directory, 'basic-index.html');
    assert(fs.existsSync(indexHtml));
  });
});

it('should call outputHandler', function() {
  var callbackSpy = sinon.spy();
  var fileName = 'basic-index.html';
  var tree = vulcanize('fixtures', {
    input: 'basic-index.html',
    outputHandler: callbackSpy
  });

  builder = new Broccoli.Builder(tree);

  return builder.build().then(function(result) {
    var indexHtml = path.join(result.directory, 'basic-index.html');
    assert(callbackSpy.withArgs(indexHtml).calledOnce);
    assert(!fs.existsSync(indexHtml));
  });
});

context('when using crisper', function() {
  it('creates a javascript file', function() {
    var tree = vulcanize('fixtures', {
      input: 'basic-index.html',
      crisper: true
    });

    builder = new Broccoli.Builder(tree);

    return builder.build().then(function(result) {
      var indexHtml = path.join(result.directory, 'basic-index.html');
      assert(fs.existsSync(indexHtml));

      var indexJs = path.join(result.directory, 'basic-index.js');
      assert(fs.existsSync(indexJs));
    });
  });

  it('calls the outputHandler on the js file', function() {
    var callbackSpy = sinon.spy();
    var fileName = 'basic-index.html';
    var tree = vulcanize('fixtures', {
      input: 'basic-index.html',
      crisper: true,
      outputHandler: callbackSpy
    });

    builder = new Broccoli.Builder(tree);

    return builder.build().then(function(result) {
      var indexHtml = path.join(result.directory, 'basic-index.html');
      assert(callbackSpy.withArgs(indexHtml).calledOnce);
      assert(!fs.existsSync(indexHtml));

      var indexJs = path.join(result.directory, 'basic-index.js');
      assert(!fs.existsSync(indexJs));
      assert(callbackSpy.withArgs(indexJs).calledOnce);
    });
  });
});
