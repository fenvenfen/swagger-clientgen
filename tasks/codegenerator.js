///<reference path="../test/types/node/node.d.ts" />
///<reference path="../test/types/mustache/mustache.d.ts" />
///<reference path="../test/types/gruntjs/gruntjs.d.ts" />
///<reference path="../test/types/swagger/swagger.d.ts" />
'use strict';
var Mustache = require('mustache');
var DefaultCodeGenerator = (function () {
    function DefaultCodeGenerator(grunt, language, framework) {
        this.language = language;
        this.framework = framework;
        this.grunt = grunt;
    }
    DefaultCodeGenerator.prototype.findTemplateFile = function (templateFile) {
        var templatePath;
        //If a framework is set try to load the file for the language and framework
        if (this.framework !== 'none') {
            templatePath = __dirname + '/templates/' + this.language + '/' + this.framework + '/' + templateFile;
            if (this.grunt.file.exists(templatePath)) {
                return templatePath;
            }
        }
        //else try to load the file for the language only
        templatePath = __dirname + '/templates/' + this.language + '/' + templateFile;
        if (this.grunt.file.exists(templatePath)) {
            return templatePath;
        }
        //If no template file is found log it and return nothing
        this.grunt.log.error('Template file ' + templatePath + ' not found');
    };
    DefaultCodeGenerator.prototype.render = function (templateFile, data) {
        var templatePath = this.findTemplateFile(templateFile);
        if (!templatePath) {
            return '';
        }
        return Mustache.render(this.grunt.file.read(templatePath), data);
    };
    DefaultCodeGenerator.prototype.findReturnType = function () {
        if (this.language === 'TypeScript') {
            //Return any for now. Need to parse the operations response objects and generate interfaces from them
            return 'any';
        }
    };
    DefaultCodeGenerator.prototype.findScheme = function (api) {
        if (api.schemes && api.schemes.indexOf('https') !== -1) {
            return 'https';
        }
        if (api.schemes && api.schemes.indexOf('http') !== -1) {
            return 'http';
        }
    };
    DefaultCodeGenerator.prototype.generateMethod = function (path, pathConfig, operation, operationConfig) {
        var methodConfig = {
            name: operationConfig.operationId,
            returnType: this.findReturnType(),
            httpMethod: operation.toUpperCase(),
            path: path
        };
        if (operationConfig.parameters) {
            methodConfig.parametersAvailable = true;
            methodConfig.params = [];
            for (var paramIndex in operationConfig.parameters) {
                var parameter = operationConfig.parameters[paramIndex];
                methodConfig.params.push({
                    name: parameter.name,
                    type: 'any',
                    location: parameter.in,
                    commaNeeded: paramIndex < operationConfig.parameters.length - 1
                });
            }
        }
        return this.render('method.mst', {
            methodConfig: methodConfig
        });
    };
    DefaultCodeGenerator.prototype.generateClass = function (apiConfig, api, methodContent) {
        return this.render('class.mst', {
            apiConfig: apiConfig,
            api: api,
            scheme: this.findScheme(api),
            methodContent: methodContent
        });
    };
    DefaultCodeGenerator.prototype.generateModule = function (apiConfig, classContent) {
        return this.render('module.mst', {
            apiConfig: apiConfig,
            classContent: classContent
        });
    };
    return DefaultCodeGenerator;
})();
function create(grunt, language, framework) {
    return new DefaultCodeGenerator(grunt, language, framework);
}
exports.create = create;
//# sourceMappingURL=codegenerator.js.map