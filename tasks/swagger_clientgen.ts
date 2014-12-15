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

import codeGen = require('./codegenerator');
var formatter = require("typescript-formatter");

class Assert {
    private grunt: IGrunt;

    constructor(grunt: IGrunt) {
        this.grunt = grunt;
    }

    defined(value: any, error: string) {
        if (typeof value === 'undefined') {
            this.grunt.log.error(error);
            return false;
        }

        return true;
    }

    exists(file: string, error: string) {
        if (!this.grunt.file.exists(file)) {
            this.grunt.log.error(error);
            return false;
        }

        return true;
    }
}

module.exports = function (grunt: IGrunt) {
    function checkApi(api: any) {
        if (!assert.defined(api.src, 'api.src must be a valid file or URL') || !assert.defined(api.target, 'api.target must be a valid file')) {
            return false;
        }

        return assert.exists(api.src, 'api.src msut be a valid file or URL');
    }

    function getDirectory(file: string) {
        return file.substring(0, file.lastIndexOf('/'));
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

            var api: SwaggerObject = grunt.file.readJSON(apiConfig.src);
            
            var codeGenerator = codeGen.create(grunt, options.language, options.framework);

            var generatedMethods: string;

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
