///<reference path="../test/types/node/node.d.ts" />
///<reference path="../test/types/mustache/mustache.d.ts" />
///<reference path="../test/types/gruntjs/gruntjs.d.ts" />
///<reference path="../test/types/swagger/swagger.d.ts" />
'use strict';

var Mustache:MustacheStatic = require('mustache');

export interface CodeGenerator {
  generateMethod(path:string, pathConfig:swagger.PathItemObject, operation:string, operationConfig:swagger.OperationObject): string;
  generateClass(apiConfig:any, api:SwaggerObject, methodContent:string): string;
  generateModule(apiConfig:any, classContent:string): string;
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
  private language:string;
  private framework:string;
  private grunt:IGrunt;

  constructor(grunt:IGrunt, language:string, framework:string) {
    this.language = language;
    this.framework = framework;
    this.grunt = grunt;
  }

  private findTemplateFile(templateFile:string):string {
    var templatePath:string;

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

  render(templateFile:string, data:any):string {
    var templatePath = this.findTemplateFile(templateFile);

    if (!templatePath) {
      return '';
    }

    return Mustache.render(this.grunt.file.read(templatePath), data);
  }

  findReturnType():string {
    if (this.language === 'TypeScript') {
      //Return any for now. Need to parse the operations response objects and generate interfaces from them
      return 'any';
    }
  }

  generateMethod(path:string, pathConfig:swagger.PathItemObject, operation:string, operationConfig:swagger.OperationObject) {
    var methodConfig:MethodConfig = {
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
  }

  generateClass(apiConfig:any, api:SwaggerObject, methodContent:string) {
    return this.render('class.mst', {
      apiConfig: apiConfig,
      api: api,
      methodContent: methodContent
    });
  }

  generateModule(apiConfig:any, classContent:string) {
    return this.render('module.mst', {
      apiConfig: apiConfig,
      classContent: classContent
    });
  }
}

export function create(grunt:IGrunt, language:string, framework:string):CodeGenerator {
  return new DefaultCodeGenerator(grunt, language, framework);
}
