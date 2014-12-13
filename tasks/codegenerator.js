'use strict';

var Mustache = require('mustache');

function CodeGenerator(grunt, language, framework) {
  this.language = language;
  this.framework = framework;
  this.grunt = grunt;
}

CodeGenerator.prototype.findTemplateFile = function(templateFile) {
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

  return;
};

CodeGenerator.prototype.render = function(templateFile, data) {
  var templatePath = this.findTemplateFile(templateFile);

  if (!templatePath) {
    return '';
  }

  return Mustache.render(this.grunt.file.read(templatePath), data);
};

CodeGenerator.prototype.generateMethod = function(methodConfig) {
  return this.render('method.mst', {
    methodConfig: methodConfig
  });
}

CodeGenerator.prototype.generateClass = function(apiConfig, api, methodContent) {
  return this.render('class.mst', {
    apiConfig: apiConfig,
    api: api,
    methodContent: methodContent
  });
};

/**
 *
 */
CodeGenerator.prototype.generateModule = function(apiConfig, classContent) {
  return this.render('module.mst', {
    apiConfig: apiConfig,
    classContent: classContent
  });
};

module.exports = function(grunt, language, framework) {
  return new CodeGenerator(grunt, language, framework);
};
