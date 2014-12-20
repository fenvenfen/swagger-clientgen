swagger-clientgen
=================

 Generate client side code out of a swagger api documentation

##Usage
Add a section called ```swagger-clientgen``` to the ```grunt.initConfig({});``` call.

```javascript
grunt.initConfig({
  swagger_clientgen: {
    my-client: {
      options: {
        language: 'TypeScript',
        framework: 'angular',
        apis: [
          {
            ...
          }
        ]
      }
    }
  }
});
```

##Available Options
###options.language
Type: ```string```

The language for the generated code. Only TypeScript is supported yet.

###options.framework
Type: ```string```

The framework that should be used for the generated code. Only angular is supported yet.

###options.apis
Type: ```Array```

Array of API Objects that configure the code to be generated.

##API Object
###src
Type: ```string```
The path or URL to the swagger api documentation. URLs are not supported yet.

###target
Type: ```string```
The name of the typescript file for the generated code.

###module
Type: ```string```
The name of the module that contains the generated client.

###className
Type: ```string```
The name of the class that is generated for the client.

###typescriptTypesLocation
Type: ```string```
The path to the TypeScript declaration files. This is used to add references to frameworks used in the generated code.
E.g. when angular is used we need a reference to the angular.d.ts file. Therefor this location is used to locate this file.
If typescriptTypesLocation is ```path/to/types``` the resulting reference to the angular file will be 
```///<reference path="path/to/types/angular/angular.d.ts" />```

###angularModuleName
Type: ```string```
The name for the angular module that is created.

###angularServiceName
Type: ```string```
The name for the angular service that contains the generated client.

##Example
TODO: add a sample
