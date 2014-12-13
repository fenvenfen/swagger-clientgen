module Swagger {

  export class SwaggerClient {
    public title = 'Swagger clientgen';
    public version = '1.0.0';
    private $http: ng.IHttpService;

    constructor($http: ng.IHttpService) {
      this.$http = $http;
    }

    public getAllThings(): ng.IHttpPromise < any > {

    }
  }

  angular.module('swaggerclient', [])
    .factory('client', ['$http',
      function($http: ng.IHttpService) {
        return new SwaggerClient($http);
      }
    ]);
}