///<reference path="../test/types/node/node.d.ts" />
/*
 * swagger-clientgen
 * https://github.com/furti/swagger-clientgen.git
 *
 * Copyright (c) 2014 furti
 * Licensed under the Apache License 2.0 license.
 */

'use strict';

var codeGen = require('./codegenerator');
var formatter = require("typescript-formatter");

module.exports = function (grunt) {
    function checkApi(api) {
        if (!assert.defined(api.src, 'api.src must be a valid file or URL') || !assert.defined(api.target, 'api.target must be a valid file')) {
            return false;
        }

        return assert.exists(api.src, 'api.src msut be a valid file or URL');
    }

    function getDirectory(file) {
        return file.substring(0, file.lastIndexOf('/'));
    }

    function Assert() {

    }

    Assert.prototype.defined = function (value, error) {
        if (typeof value === 'undefined') {
            grunt.log.error(error);
            return false;
        }

        return true;
    };

    Assert.prototype.exists = function (file, error) {
        if (!grunt.file.exists(file)) {
            grunt.log.error(error);
            return false;
        }

        return true;
    };

    var assert = new Assert();


    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('swagger_clientgen', 'Generate client side code out of a swagger api documentation', function () {

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

            var generatedMethods;

            if (api.paths) {
                generatedMethods = '';

                for (var path in api.paths) {
                    var pathConfig = api.paths[path];

                    for (var operation in pathConfig) {
                        var operationConfig = pathConfig[operation];

                        if (generatedMethods.length >= 1) {
                            generatedMethods += '\r\n\r\n';
                        }

                        generatedMethods += codeGenerator.generateMethod(path, pathConfig, operation, operationConfig);
                    }
                }
            }

            var generatedClass = codeGenerator.generateClass(apiConfig, api, generatedMethods);
            var generatedModule = codeGenerator.generateModule(apiConfig, generatedClass);

            grunt.file.write(apiConfig.target, generatedModule);

            /**
             * The formatter needs a tsfmt.json for configuration that is located next to the ts file.
             * So we crate one and delete it after formatting
             */
            var tsfmt = getDirectory(apiConfig.target) + '/tsfmt.json';
            grunt.file.write(tsfmt, grunt.file.read(__dirname + '/tsfmt.json'));

            formatter.processFiles([apiConfig.target], {
                replace: true,
                tsfmt: true
            });

            grunt.file.delete(tsfmt);
        }
    });

};