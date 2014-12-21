///<reference path="../test/types/node/node.d.ts" />
///<reference path="../test/types/mustache/mustache.d.ts" />
///<reference path="../test/types/gruntjs/gruntjs.d.ts" />
///<reference path="../test/types/swagger/swagger.d.ts" />
'use strict';
var Mustache = require('mustache');
var DefaultCodeGenerator = (function () {
    function DefaultCodeGenerator(grunt, language, framework) {
        this.typeMappings = {
            "integer": "number",
            "long": "number",
            "float": "number",
            "double": "number",
            "byte": "string",
            "string": "string",
            "boolean": "boolean",
            "date": "Date",
            "dateTime": "Date"
        };
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
    DefaultCodeGenerator.prototype.capitalize = function (s) {
        if (s.length === 1) {
            return s.toUpperCase();
        }
        return s.substring(0, 1).toUpperCase() + s.substring(1);
    };
    DefaultCodeGenerator.prototype.extractProperties = function (schema) {
        if (!schema.properties) {
            return;
        }
        var props = [];
        for (var property in schema.properties) {
            props.push({
                name: property,
                type: this.typeMappings[schema.properties[property].type]
            });
        }
        return props;
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
    DefaultCodeGenerator.prototype.generateResponseInterfaces = function (operation) {
        if (!operation.responses) {
            return '';
        }
        var responseDefinition;
        if (operation.responses["201"]) {
            responseDefinition = operation.responses["201"];
        }
        else if (operation.responses["200"]) {
            responseDefinition = operation.responses["200"];
        }
        else {
            responseDefinition = operation.responses.default;
        }
        if (!responseDefinition) {
            throw 'Only responses for status 200, 201 and default responses are supported yet';
        }
        if (!responseDefinition.schema) {
            return '';
        }
        var interfaceName = this.capitalize(operation.operationId) + 'Response';
        var interfaceProps;
        if (responseDefinition.schema.type === 'array') {
            interfaceProps = this.extractProperties(responseDefinition.schema.items);
        }
        else {
            interfaceProps = this.extractProperties(responseDefinition.schema);
        }
        return this.render('interface.mst', {
            interfaceName: interfaceName,
            properties: interfaceProps
        });
    };
    DefaultCodeGenerator.prototype.generateModule = function (apiConfig, classContent, interfacesContent) {
        return this.render('module.mst', {
            apiConfig: apiConfig,
            classContent: classContent,
            interfacesContent: interfacesContent
        });
    };
    return DefaultCodeGenerator;
})();
function create(grunt, language, framework) {
    return new DefaultCodeGenerator(grunt, language, framework);
}
exports.create = create;
//# sourceMappingURL=codegenerator.js.map