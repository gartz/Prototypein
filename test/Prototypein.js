var should = require('should');
var Entity = require('../src/Entity').Entity;
describe('Prototypein  should', function() {

  it('be available on global scope', function() {
    (Prototypein).should.be.ok;
  });
});
