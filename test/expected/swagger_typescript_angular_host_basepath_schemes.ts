/// <reference path="../../test/types/angular/angular.d.ts" />
module Swagger {

    export class SwaggerClient {
        public title = 'Swagger clientgen';
        public version = '1.0.0';
        private $http: ng.IHttpService;
        private host: string = "somehost";
        private basePath: string = "/base";
        private scheme: string = "https";

        constructor($http: ng.IHttpService) {
            this.$http = $http;
        }

        private buildUrl(path: string): string {
            var url: string = '';

            if (this.host) {
                if (!this.scheme) {
                    url = 'https://';
                }
                else {
                    url = this.scheme + '://';
                }

                url += this.host;
            }

            if (this.basePath) {
                url += this.basePath;
            }

            return url + path;
        }

        private createRequestConfig(path: string, method: string, parameters?: any): ng.IRequestConfig {
            var config: ng.IRequestConfig = {
                method: method,
                url: this.buildUrl(path)
            };

            if (parameters) {
                var query: string;
                var headers: any;

                for (var paramName in parameters) {
                    var parameter = parameters[paramName];

                    if (parameter.type === 'body') {
                        config.data = parameter.value;
                    }

                    if (parameter.type === 'path') {
                        config.url = config.url.replace('{' + paramName + '}', parameter.value);
                    }

                    //Add query parameters only if the value is defined
                    if (parameter.type === 'query' && angular.isDefined(parameter.value) && parameter.value !== null) {
                        if (angular.isDefined(query)) {
                            query += '&';
                        }
                        else {
                            query = '?';
                        }

                        query += paramName + '=' + parameter.value;
                    }

                    //Add header parameters only if the value is defined
                    if (parameter.type === 'header' && angular.isDefined(parameter.value) && parameter.value !== null) {
                        if (!angular.isDefined(headers)) {
                            headers = {};
                        }

                        headers[paramName] = parameter.value;
                    }
                }

                if (angular.isDefined(query)) {
                    config.url += query;
                }

                if (angular.isDefined(headers)) {
                    config.headers = headers;
                }
            }

            return config;
        }

        public setHost(host: string) {
            this.host = host;
        }

        public setScheme(scheme: string) {
            this.scheme = scheme;
        }

        public setBasePath(basePath: string) {
            this.basePath = basePath;
        }

        public getAllThings(): ng.IHttpPromise<any> {
            return this.$http(this.createRequestConfig('/something', 'GET'));
        }
    }

    angular.module('swaggerclient', [])
        .factory('client', ['$http',
            function ($http: ng.IHttpService) {
                return new SwaggerClient($http);
            }
        ]);
}