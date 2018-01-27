var assert = require('assert')
var TypAsync = require('../index')

describe('TypAsync', function() {

  describe('#change()', function() {
    it('should have value same as changed value', function(done) {
      var typing = new TypAsync()

      typing.change('text')
      
      setTimeout(function() {
        assert.equal(typing.value, 'text')
        done()
      }, 500)

    })
  })

  describe('#on()', function() {
    var typing = new TypAsync()

    it('should have 6 events', function(done) {
      var events = 0
      for (var i in typing._events) {
        ++events
      }

      assert.equal(events, 6);
      done()
    })

    it('should have event change', function(done) {
      assert.equal(typeof typing._events.change, 'function');
      done()
    })

    it('should have event empty', function(done) {
      typing.on('empty', function() {})
      assert.equal(typeof typing._events.empty, 'function')
      done()
    })

    it('should have event skip', function(done) {
      typing.on('skip', function() {})
      assert.equal(typeof typing._events.skip, 'function')
      done()
    })

    it('should have event value', function(done) {
      typing.on('value', function() {})
      assert.equal(typeof typing._events.value, 'function')
      done()
    })

    it('should have event process', function(done) {
      typing.on('process', function() {})
      assert.equal(typeof typing._events.process, 'function')
      done()
    })

    it('should have event complete', function(done) {
      typing.on('complete', function() {})
      assert.equal(typeof typing._events.complete, 'function')
      done()
    })

    it('should change event callback scope is instanceof TypAsync', function(done) {
      return new Promise(function(resolve) {
        typing.value = '';
        typing.processing = false;
        typing.on('change', function() {
          assert.equal(this instanceof TypAsync, true)
          done()
        })
        typing._events.change('text')
      }).then(done)
    })

    it('should value event callback scope is instanceof TypAsync', function(done) {
      return new Promise(function(resolve) {
        typing.processing = false;
        typing.on('value', function(value) {
          assert.equal(this instanceof TypAsync, true)
          done()
          return value;
        })
        typing._events.value('text')
      }).then(done)
    })

    it('should empty event callback scope is instanceof TypAsync', function(done) {
      return new Promise(function(resolve) {
        typing.processing = false;
        typing.on('empty', function() {
          assert.equal(this instanceof TypAsync, true)
          done()
        })
        typing._events.empty()
      }).then(done)
    })

    it('should skip event callback scope is instanceof TypAsync', function(done) {
      return new Promise(function(resolve) {
        typing.processing = false;
        typing.on('skip', function() {
          assert.equal(this instanceof TypAsync, true)
          done()
        })
        typing._events.skip()
      }).then(done)
    })

    it('should process event callback scope is instanceof TypAsync', function(done) {
      return new Promise(function(resolve) {
        typing.processing = false;
        typing.on('process', function() {
          assert.equal(this instanceof TypAsync, true)
          done()
        })
        typing._events.process()
      }).then(done)
    })

    it('should complete event callback scope is instanceof TypAsync', function(done) {
      return new Promise(function(resolve) {
        typing.processing = false;
        typing.on('complete', function() {
          assert.equal(this instanceof TypAsync, true)
          done()
        })
        typing._events.complete()
      }).then(done)
    })

    it('should default timeout is 500 ms', function() {
      assert.equal(typing.options.timeout, 500);
    })

  })

})