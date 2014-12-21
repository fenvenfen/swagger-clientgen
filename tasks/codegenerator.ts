///<reference path="../test/types/node/node.d.ts" />
///<reference path="../test/types/mustache/mustache.d.ts" />
///<reference path="../test/types/gruntjs/gruntjs.d.ts" />
///<reference path="../test/types/swagger/swagger.d.ts" />
'use strict';

var Mustache: MustacheStatic = require('mustache');

export interface CodeGenerator {
    generateMethod(path: string, pathConfig: swagger.PathItemObject, operation: string, operationConfig: swagger.OperationObject): string;
    generateClass(apiConfig: any, api: SwaggerObject, methodContent: string): string;
    generateResponseInterfaces(operation: swagger.OperationObject): string;
    generateModule(apiConfig: any, classContent: string, interfacesContent: string): string;
}

interface MethodConfig {
    name: string;
    returnType: string;
    httpMethod: string;
    path: string;
    parametersAvailable?: boolean;
    params?: Array<MethodParameter>;
}

interface MethodParameter {
    name: string;
    type: string;
    location: string;
    commaNeeded: boolean;
}

class DefaultCodeGenerator implements CodeGenerator {
    private language: string;
    private framework: string;
    private grunt: IGrunt;
    private test: Date;
    private typeMappings = {
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

    constructor(grunt: IGrunt, language: string, framework: string) {
        this.language = language;
        this.framework = framework;
        this.grunt = grunt;
    }

    private findTemplateFile(templateFile: string): string {
        var templatePath: string;

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
    }

    private render(templateFile: string, data: any): string {
        var templatePath = this.findTemplateFile(templateFile);

        if (!templatePath) {
            return '';
        }

        return Mustache.render(this.grunt.file.read(templatePath), data);
    }

    private findResponseDefinition(operation: swagger.OperationObject): swagger.ResponseObject {
        if (!operation.responses) {
            return;
        }

        if (operation.responses["201"]) {
            return operation.responses["201"];
        }
        else if (operation.responses["200"]) {
            return operation.responses["200"];
        }
        else {
            return operation.responses.default;
        }
    }

    private findReturnType(operation: swagger.OperationObject): string {
        if (this.language === 'TypeScript') {
            var responseDefinition = this.findResponseDefinition(operation);

            //If not schema is defined return any
            if (!responseDefinition || !responseDefinition.schema) {
                return 'any';
            }

            var returnType = this.capitalize(operation.operationId) + 'Response';

            //If it is a object we must build the name
            if (responseDefinition.schema.type === 'object') {
                return returnType;
            }
            else if (responseDefinition.schema.type === 'array') {
                return 'Array<' + returnType + '>';
            }
            else {
                return this.typeMappings[responseDefinition.schema.type];
            }
        }
    }

    private findScheme(api: SwaggerObject): string {
        if (api.schemes && api.schemes.indexOf('https') !== -1) {
            return 'https';
        }

        if (api.schemes && api.schemes.indexOf('http') !== -1) {
            return 'http';
        }
    }

    private capitalize(s: string): string {
        if (s.length === 1) {
            return s.toUpperCase();
        }

        return s.substring(0, 1).toUpperCase() + s.substring(1);
    }

    private extractProperties(schema: swagger.SchemaObject): Array<any> {
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
    }

    generateMethod(path: string, pathConfig: swagger.PathItemObject, operation: string, operationConfig: swagger.OperationObject) {
        var methodConfig: MethodConfig = {
            name: operationConfig.operationId,
            returnType: this.findReturnType(operationConfig),
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
    }

    generateClass(apiConfig: any, api: SwaggerObject, methodContent: string) {

        return this.render('class.mst', {
            apiConfig: apiConfig,
            api: api,
            scheme: this.findScheme(api),
            methodContent: methodContent
        });
    }

    generateResponseInterfaces(operation: swagger.OperationObject): string {
        if (!operation.responses) {
            return '';
        }

        var responseDefinition = this.findResponseDefinition(operation);

        if (!responseDefinition) {
            throw 'Only responses for status 200, 201 and default responses are supported yet';
        }

        if (!responseDefinition.schema) {
            return '';
        }

        var interfaceName = this.capitalize(operation.operationId) + 'Response';
        var interfaceProps: Array<any>;

        if (responseDefinition.schema.type === 'array') {
            if (responseDefinition.schema.items.type === 'object') {
                interfaceProps = this.extractProperties(responseDefinition.schema.items)
            }
        }
        else if (responseDefinition.schema.type === 'object') {
            interfaceProps = this.extractProperties(responseDefinition.schema);
        }

        if (interfaceProps && interfaceProps.length > 0) {
            return this.render('interface.mst', {
                interfaceName: interfaceName,
                properties: interfaceProps
            });
        }
        else {
            return '';
        }
    }

    generateModule(apiConfig: any, classContent: string, interfacesContent: string) {
        return this.render('module.mst', {
            apiConfig: apiConfig,
            classContent: classContent,
            interfacesContent: interfacesContent
        });
    }
}

export function create(grunt: IGrunt, language: string, framework: string): CodeGenerator {
    return new DefaultCodeGenerator(grunt, language, framework);
}
