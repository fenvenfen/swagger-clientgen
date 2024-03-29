'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.swagger_clientgen = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  typescript_angular: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/actual/swagger_typescript_angular.ts');
    var expected = grunt.file.read('test/expected/swagger_typescript_angular.ts');
	
	test.equal(actual, expected, 'Content of files not equals');

    test.done();
  },
  typescript_angular_host_basepath_scheme: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/actual/swagger_typescript_angular_host_basepath_schemes.ts');
    var expected = grunt.file.read('test/expected/swagger_typescript_angular_host_basepath_schemes.ts');
    test.equal(actual, expected, 'Content of files not equals');

    test.done();
  }
  /*,
  custom_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/custom_options');
    var expected = grunt.file.read('test/expected/custom_options');
    test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');

    test.done();
  }*/
};
