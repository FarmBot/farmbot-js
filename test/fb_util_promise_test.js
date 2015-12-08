describe('Farmbot promise object', function() {
  beforeAll(function(done) {
    done();
  });

  it('has a default label', function(){
    var $p = Farmbot.defer("Testing defer()");
    expect($p.label).toEqual("Testing defer()");
    var $p = Farmbot.defer();
    expect($p.label).toEqual("a promise");
  })

  it('resolves', function(done){
    var $p = Farmbot.defer("Testing defer()");
    var finished = "The promise is resolved."
    expect($p.finished).toBeFalsy();
    $p
      .then(function(value) {
        expect(value).toEqual(finished);
        expect($p.finished).toBeTruthy();
        done();
      });
    $p.resolve(finished);
  });

  it('rejects', function(done){
    var $p = Farmbot.defer("Testing defer()");
    var finished = "The promise is resolved."
    expect($p.finished).toBeFalsy();
    $p
      .catch(function(value) {
        expect($p.label).toEqual("Testing defer()");
        expect(value).toEqual(finished);
        expect($p.finished).toBeTruthy();
        done();
      });
    $p.reject(finished);
  });

  it('resolves before timeout', function(done){
    var $p = Farmbot.timerDefer("Testing timerDefer()");
    var finished = "The promise is resolved.";
    expect($p.finished).toBeFalsy();
    $p
      .then(function(value) {
        expect(value).toEqual(finished);
        expect($p.finished).toBeTruthy();
        done();
      });
    $p.resolve(finished);
  });

  it('rejects after timeout', function(done){
    var $p = Farmbot.timerDefer(1, "Testing timeDefer() timeout");
    $p.catch(function(value){
      expect($p.finished).toBeTruthy();
      expect(value.message).toContain("did not execute");
      done();
    })
  });

});
