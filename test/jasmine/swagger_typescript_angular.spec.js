describe('Test the client', function () {
  var $httpBackend, client;

  beforeEach(module('swaggerclient'));

  beforeEach(inject(function ($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');

    client = $injector.get('client');
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('Client is defined', function () {
    expect(client).toBeDefined();
  });

  it('getAllThings is a function', function () {
    expect(typeof client.getAllThings).toBe('function');
  });

  it('createThing is a function', function () {
    expect(typeof client.createThing).toBe('function');
  });

  it('Test getAllThings', function () {
    $httpBackend.expectGET('/something').respond(200, angular.fromJson([{
      id: 1,
      name: 'Thing'
    }]));
    var response = client.getAllThings();
    expect(response).toBeDefined();

    //Check that the success method is called
    var success = false;

    response.success(function (data) {
      success = true;

      expect(data.length).toBe(1);
      expect(data[0].id).toBe(1);
      expect(data[0].name).toBe('Thing');
    });

    $httpBackend.flush();
    expect(success).toBe(true);
  });

  it('Test createThing', function () {
    var thing = {
      name: 'Thing'
    };

    /**
     * A Post to /something should be made containing the thing. It should respond with the id of the newly created thing
     */
    $httpBackend.expectPOST('/something', thing).respond(200, angular.fromJson({
      id: 1
    }));
    var response = client.createThing(thing);
    expect(response).toBeDefined();

    //Check that the success method is called
    var success = false;

    response.success(function (data) {
      success = true;

      expect(data.id).toBe(1);
    });

    $httpBackend.flush();
    expect(success).toBe(true);
  });

  it('Test deleteThing', function () {
    $httpBackend.expectDELETE('/something/1').respond(200);

    var response = client.deleteThing(1);
    expect(response).toBeDefined();

    var success = false;

    response.success(function (data) {
      success = true;
    });

    $httpBackend.flush();
    expect(success).toBe(true);
  });

  it('Test updateThing', function () {
    var thing = {
      name: 'Fancy Name'
    };

    $httpBackend.expectPUT('/something/1', thing).respond(200);

    var response = client.updateThing(1, thing);
    expect(response).toBeDefined();

    var success = false;

    response.success(function (data) {
      success = true;
    });

    $httpBackend.flush();
    expect(success).toBe(true);
  });

  it('Test searchQuery with defined parameter', function () {
    $httpBackend.expectGET('/query?q=search').respond(200, 'found');

    var response = client.searchQuery('search');
    expect(response).toBeDefined();

    var success = false;

    response.success(function (data) {
      success = true;
      expect(data).toBe('found');
    });

    $httpBackend.flush();
    expect(success).toBe(true);
  });

  it('Test searchQuery with undefined parameter', function () {
    $httpBackend.expectGET('/query').respond(200, 'found');

    var response = client.searchQuery(undefined);
    expect(response).toBeDefined();

    var success = false;

    response.success(function (data) {
      success = true;
      expect(data).toBe('found');
    });

    $httpBackend.flush();
    expect(success).toBe(true);
  });

  it('Test searchQuery with null parameter', function () {
    $httpBackend.expectGET('/query').respond(200, 'found');

    var response = client.searchQuery(null);
    expect(response).toBeDefined();

    var success = false;

    response.success(function (data) {
      success = true;
      expect(data).toBe('found');
    });

    $httpBackend.flush();
    expect(success).toBe(true);
  });

  it('Test sendHeader with defined parameter', function () {
    $httpBackend.expectHEAD('/header', function (headers) {
      return headers.token === 'abc';
    }).respond(200, 'found');

    var response = client.sendHeader('abc');
    expect(response).toBeDefined();

    var success = false;

    response.success(function (data) {
      success = true;
      expect(data).toBe('found');
    });

    $httpBackend.flush();
    expect(success).toBe(true);
  });

  it('Test sendHeader with undefined parameter', function () {
    $httpBackend.expectHEAD('/header', function (headers) {
      return angular.isUndefined(headers.token);
    }).respond(200, 'found');

    var response = client.sendHeader(undefined);
    expect(response).toBeDefined();

    var success = false;

    response.success(function (data) {
      success = true;
      expect(data).toBe('found');
    });

    $httpBackend.flush();
    expect(success).toBe(true);
  });

  it('Test sendHeader with null parameter', function () {
    $httpBackend.expectHEAD('/header', function (headers) {
      return angular.isUndefined(headers.token);
    }).respond(200, 'found');

    var response = client.sendHeader(null);
    expect(response).toBeDefined();

    var success = false;

    response.success(function (data) {
      success = true;
      expect(data).toBe('found');
    });

    $httpBackend.flush();
    expect(success).toBe(true);
  });
});
