///<reference path="../test/types/node/node.d.ts" />
///<reference path="../test/types/swagger/swagger.d.ts" />
///<reference path="./codegenerator.ts" />
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
var Assert = (function () {
    function Assert(grunt) {
        this.grunt = grunt;
    }
    Assert.prototype.defined = function (value, error) {
        if (typeof value === 'undefined') {
            this.grunt.log.error(error);
            return false;
        }
        return true;
    };
    Assert.prototype.exists = function (file, error) {
        if (!this.grunt.file.exists(file)) {
            this.grunt.log.error(error);
            return false;
        }
        return true;
    };
    return Assert;
})();
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
    function handleOperation(operationConfig, operation, path, pathConfig, codeGenerator, appendNewlines) {
        //If the operation is not defined --> nothing to do
        if (!operationConfig) {
            return '';
        }
        var generated = '';
        if (appendNewlines) {
            generated += '\n';
        }
        generated += codeGenerator.generateMethod(path, pathConfig, operation, operationConfig);
        return generated;
    }
    var assert = new Assert(grunt);
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
            var codeGenerator = codeGen.create(grunt, options.language, options.framework);
            var generatedMethods, pathConfig;
            if (api.paths) {
                generatedMethods = '';
                for (var path in api.paths) {
                    pathConfig = api.paths[path];
                    generatedMethods += handleOperation(pathConfig.get, 'get', path, pathConfig, codeGenerator, generatedMethods.length >= 1);
                    generatedMethods += handleOperation(pathConfig.delete, 'delete', path, pathConfig, codeGenerator, generatedMethods.length >= 1);
                    generatedMethods += handleOperation(pathConfig.head, 'head', path, pathConfig, codeGenerator, generatedMethods.length >= 1);
                    generatedMethods += handleOperation(pathConfig.options, 'options', path, pathConfig, codeGenerator, generatedMethods.length >= 1);
                    generatedMethods += handleOperation(pathConfig.patch, 'patch', path, pathConfig, codeGenerator, generatedMethods.length >= 1);
                    generatedMethods += handleOperation(pathConfig.post, 'post', path, pathConfig, codeGenerator, generatedMethods.length >= 1);
                    generatedMethods += handleOperation(pathConfig.put, 'put', path, pathConfig, codeGenerator, generatedMethods.length >= 1);
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
//# sourceMappingURL=swagger_clientgen.js.map