function inc(a){
    return a+1;
}

describe("some", function() {

  it("test some", function() {
    assert.equal(inc(1), 2);
  });

});
