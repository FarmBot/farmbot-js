describe('Farmbot', function() {
  it('extends objects using .extend(obj, [mixins...])', function() {
    var extended = {};
    var mixin1 = {
      mixin1: 123
    };
    var mixin2 = {
      mixin2: 456
    };
    Farmbot.extend(extended, [mixin1, mixin2]);

    expect(extended.mixin1).toEqual(123);
    expect(extended.mixin2).toEqual(456);
  });

  it('validates input options against required fields', function() {
    expect(Farmbot.requireKeys).toBeDefined();

    var requiredFields = ['important'];
    var expectedError = new Error(
      'Expected input object to have `important` property');
    var badAttempt = function() {
      Farmbot.requireKeys({}, requiredFields)
    };
    var goodAttempt = function() {
      Farmbot.requireKeys({
        important: 'yes'
      }, requiredFields);
    };

    expect(badAttempt).toThrow(expectedError);
    expect(goodAttempt).not.toThrow(expectedError);
  });

  it('generates UUIDs', function(){
    expect(Farmbot.uuid).toBeDefined;
    var uuid = Farmbot.uuid();
    var segments = uuid.split("-");

    expect(uuid.length).toEqual(36);
    expect(uuid[14]).toEqual('4');
    expect(segments.length).toEqual(5);
    expect(segments.pop().length).toEqual(12);
    expect(segments.pop().length).toEqual(4);
    expect(segments.pop().length).toEqual(4);
    expect(segments.pop().length).toEqual(4);
    expect(segments.pop().length).toEqual(8);
  });

  it('generates tokens', function(){
    expect(Farmbot.token).toBeDefined;
    var token = Farmbot.token();
    expect(token.length).toEqual(40);
    expect(token).toMatch(/[0-9a-f]{40}/);
  });

});
