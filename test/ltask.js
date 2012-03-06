#!/usr/bin/env node
//
//
//
// @copyright 2012 by Lee Olayvar
//
/*jshint asi: true*/
var should = require('should')
var LTask = require('../lib/ltask')

// These are here so my IDE will shut the hell up.
var after = global.after,
    afterEach = global.afterEach,
    before = global.before,
    beforeEach = global.beforeEach,
    describe = global.describe,
    it = global.it


describe('An ltask instance', function () {
  var ltask = undefined
  
  describe('with no task on creation', function () {
    before(function () {
      ltask = new LTask()
    })
    
    it('should be complete before it\'s started', function () {
      ltask._task_started.should.equal(false)
      ltask._task_completed.should.equal(false)
    })
    
    it('should be complete after it\'s started', function () {
      // Start the ltask
      ltask.start()
      // Note that we did not give it any asnyc functions, so this
      // ltask is actually synchronous. So we should be able
      // to test it in this manner.
      ltask._task_started.should.equal(true)
      ltask._task_completed.should.equal(true)
    })
  })
  
  describe('given a creation task', function () {
    
    it('should call the given task when started', function (done) {
      new LTask(function () {
        // Call our tests done function.
        done()
      }).start()
    })
  })
})