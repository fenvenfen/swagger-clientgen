/*
 * swagger-clientgen
 * https://github.com/furti/swagger-clientgen.git
 *
 * Copyright (c) 2014 furti
 * Licensed under the Apache License 2.0 license.
 */

'use strict';

var codeGen = require('./codegenerator');
var beautify = require('js-beautify').js_beautify;

module.exports = function(grunt) {
  function checkApi(api) {
    if (!assert.defined(api.src, 'api.src must be a valid file or URL') || !assert.defined(api.target, 'api.target must be a valid file')) {
      return false;
    }

    return assert.exists(api.src, 'api.src msut be a valid file or URL');
  }

  function Assert() {

  }

  Assert.prototype.defined = function(value, error) {
    if (typeof value === 'undefined') {
      grunt.log.error(error);
      return false;
    }

    return true;
  };

  Assert.prototype.exists = function(file, error) {
    if (!grunt.file.exists(file)) {
      grunt.log.error(error);
      return false;
    }

    return true;
  };

  var assert = new Assert();


  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('swagger_clientgen', 'Generate client side code out of a swagger api documentation', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      language: 'TypeScript',
      framework: 'angular' //none, angular
    });

    if (!(options.apis instanceof Array)) {
      grunt.log.error('apis must be an array');
      return false;
    }

    for (var i in options.apis) {
      var apiConfig = options.apis[i];

      if (!checkApi(apiConfig)) {
        return false;
      }

      var api = grunt.file.readJSON(apiConfig.src);

      var codeGenerator = codeGen(grunt, options.language, options.framework);

      var generatedClass = codeGenerator.generateClass(apiConfig, api);
      var generatedModule = codeGenerator.generateModule(apiConfig, generatedClass);

      grunt.file.write(apiConfig.target, beautify(generatedModule, {
        indent_size: 2,
        max_preserve_newlines: 2,
        end_with_newline: true
      }));
    }
  });

};
