describe('Test the client with host, basepath and schemes', function () {
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

  it('Test getAllThings', function () {
    $httpBackend.expectGET('https://somehost/base/something').respond(200, 'found');

    var response = client.getAllThings();
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
