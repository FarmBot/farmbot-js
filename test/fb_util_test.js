describe('FarmbotJS.util', function() {
  it('extends objects using .extend(obj, [mixins...])', function() {
    var extended = {};
    var mixin1 = {
      mixin1: 123
    };
    var mixin2 = {
      mixin2: 456
    };
    FarmbotJS.util.extend(extended, [mixin1, mixin2]);

    expect(extended.mixin1).toEqual(123);
    expect(extended.mixin2).toEqual(456);
  });

  it('validates input options against required fields', function() {
    expect(FarmbotJS.util.requireKeys).toBeDefined();

    var requiredFields = ['important'];
    var expectedError = new Error(
      'Expected input object to have `important` property');
    var badAttempt = function() {
      FarmbotJS.util.requireKeys({}, requiredFields)
    };
    var goodAttempt = function() {
      FarmbotJS.util.requireKeys({
        important: 'yes'
      }, requiredFields);
    };

    expect(badAttempt).toThrow(expectedError);
    expect(goodAttempt).not.toThrow(expectedError);
  });

  it('generates UUIDs', function(){
    expect(FarmbotJS.util.uuid).toBeDefined;
    var uuid = FarmbotJS.util.uuid();
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
    expect(FarmbotJS.util.token).toBeDefined;
    var token = FarmbotJS.util.token();
    expect(token.length).toEqual(40);
    expect(token).toMatch(/[0-9a-f]{40}/);
  });

});
