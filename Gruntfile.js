/*
 * swagger-clientgen
 * https://github.com/furti/swagger-clientgen.git
 *
 * Copyright (c) 2014 furti
 * Licensed under the Apache License 2.0 license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    //use unix style lineendings in expected files as bracktes creates windows line endings but our plugin creates unix style ones.
    lineending: { // Task
      dist: { // Target
        options: { // Target options
          eol: 'crlf',
          overwrite: true
        },
        files: { // Files to process
          '': ['test/expected/*']
        }
      }
    },

    karma: {
      options: {
        frameworks: ['jasmine'],
        plugins: [
          'karma-jasmine',
          'karma-phantomjs-launcher'
        ],
        browsers: ['PhantomJS']
      },
      typescript_angular: {
        options: {
          files: [
            'test/lib/angular.js',
            'test/lib/angular-mocks.js',
            'tmp/actual/swagger_typescript_angular.js',
            'test/jasmine/swagger_typescript_angular.spec.js'
          ]
        },
        singleRun: true,
        autoWatch: false
      },
      typescript_angular_host_basepath_schemes: {
        options: {
          files: [
            'test/lib/angular.js',
            'test/lib/angular-mocks.js',
            'tmp/actual/swagger_typescript_angular_host_basepath_schemes.js',
            'test/jasmine/swagger_typescript_angular_host_basepath_schemes.spec.js'
          ]
        },
        singleRun: true,
        autoWatch: false
      }
    },

    typescript: {
      typescript_angular: {
        src: ['tmp/actual/swagger_typescript_angular.ts'],
        dest: 'tmp/actual/swagger_typescript_angular.js',
        options: {
          module: 'commonjs',
          target: 'es5',
          sourceMap: false
        }
      },
      typescript_angular_host_basepath_schemes: {
        src: ['tmp/actual/swagger_typescript_angular_host_basepath_schemes.ts'],
        dest: 'tmp/actual/swagger_typescript_angular_host_basepath_schemes.js',
        options: {
          module: 'commonjs',
          target: 'es5',
          sourceMap: false
        }
      }
    },

    // Configuration to be run (and then tested).
    swagger_clientgen: {
      typescript_angular: {
        options: {
          apis: [{
            src: 'test/swagger.json',
            target: 'tmp/actual/swagger_typescript_angular.ts',
            module: 'Swagger',
            className: 'SwaggerClient',
            typescriptTypesLocation: '../../test/types',
            angularModuleName: 'swaggerclient',
            angularServiceName: 'client'
          }, {
            src: 'test/swagger_host_basePath_schemes.json',
            target: 'tmp/actual/swagger_typescript_angular_host_basepath_schemes.ts',
            module: 'Swagger',
            className: 'SwaggerClient',
            typescriptTypesLocation: '../../test/types',
            angularModuleName: 'swaggerclient',
            angularServiceName: 'client'
          }]
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'lineending', 'swagger_clientgen', 'typescript', 'nodeunit', 'karma']);
  
  grunt.registerTask('generate', ['clean', 'lineending', 'swagger_clientgen', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
