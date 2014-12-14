describe('Test the client', function() {
  var $httpBackend, client;

  beforeEach(module('swaggerclient'));

  beforeEach(inject(function($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');

    client = $injector.get('client');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('Client is defined', function() {
    expect(client).toBeDefined();
  });

  it('getAllThings is a function', function() {
    expect(typeof client.getAllThings).toBe('function');
  });

  it('createThing is a function', function() {
    expect(typeof client.createThing).toBe('function');
  });

  it('Test getAllThings', function() {
    $httpBackend.expectGET('/something').respond(200, angular.fromJson([{
      id: 1,
      name: 'Thing'
    }]));
    var response = client.getAllThings();
    expect(response).toBeDefined();

    //Check that the success method is called
    var success = false;

    response.success(function(data) {
      success = true;

      expect(data.length).toBe(1);
      expect(data[0].id).toBe(1);
      expect(data[0].name).toBe('Thing');
    });

    $httpBackend.flush();
    expect(success).toBe(true);
  });

  it('Test createThing', function() {
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

    response.success(function(data) {
      success = true;

      expect(data.id).toBe(1);
    });

    $httpBackend.flush();
    expect(success).toBe(true);
  });
});
