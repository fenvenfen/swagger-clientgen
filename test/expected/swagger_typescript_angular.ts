/// <reference path="../../test/types/angular/angular.d.ts" />
module Swagger {

    export class SwaggerClient {
        public title = 'Swagger clientgen';
        public version = '1.0.0';
        private $http: ng.IHttpService;

        constructor($http: ng.IHttpService) {
            this.$http = $http;
        }

        private createRequestConfig(path: string, method: string, parameters?: any): ng.IRequestConfig {
            var config: ng.IRequestConfig = {
                method: method,
                url: path
            };

            if (parameters) {
                for (var paramName in parameters) {
                    var parameter = parameters[paramName];

                    if (parameter.type === 'body') {
                        config.data = parameter.value;
                    }
                }
            }

            return config;
        }

        public getAllThings(): ng.IHttpPromise<any> {
            return this.$http(this.createRequestConfig('/something', 'GET'));
        }

        public createThing(thing: any): ng.IHttpPromise<any> {
            return this.$http(this.createRequestConfig('/something', 'POST', {
                'thing': {
                    value: thing,
                    type: 'body'
                }
            }));
        }
    }

    angular.module('swaggerclient', [])
        .factory('client', ['$http',
            function ($http: ng.IHttpService) {
                return new SwaggerClient($http);
            }
        ]);
}
