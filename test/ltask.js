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
var before = global.before
  , beforeEach = global.beforeEach
  , describe = global.describe
  , it = global.it


describe('LTask', function () {
  var ltask = undefined
  
  describe('#init', function () {
    
    describe('with no task on creation', function () {
      before(function () {
        ltask = new LTask()
      })
      
      it('should not be completed before it\'s started', function () {
        ltask._task_started.should.equal(false)
        ltask._task_completed.should.equal(false)
      })
      
      it('should be completed after it\'s started', function () {
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
  
  describe('#seq', function () {
    var seq = undefined
    
    describe('give seq a function', function () {
      beforeEach(function () {
        ltask = new LTask()
        seq = ltask.seq(function (next) { next() })
        ltask.start()
      })
      
      it('should show started', function () {
        seq._task_started.should.equal(true)
      })
      
      it('should show completed', function () {
        seq._task_completed.should.equal(true)
      })
    })
    
    describe ('call one seq on another', function () {
      beforeEach(function () {
        ltask = new LTask()
        seq = ltask.seq(
          function (next) { next() }
        ).seq(
          function (next) { next() }
        )
        ltask.start()
      })
      
      it('should show started', function () {
        seq._task_started.should.equal(true)
      })
      
      it('should show completed', function () {
        seq._task_completed.should.equal(true)
      })
    })
  })
  
  describe('#req', function () {
    
    describe('req an unfinishing task', function () {
      beforeEach(function () {
        ltask = new LTask()
        ltask.req(new LTask(function (next) {}))
        ltask.start()
      })
      
      it('should not show started', function () {
        ltask.started().should.equal(false)
      })
      
      it('should not show completed', function () {
        ltask.completed().should.equal(false)
      })
    })
    
    describe('req a finishing task', function () {
      beforeEach(function () {
        ltask = new LTask()
        ltask.req(new LTask(function (next) { next() }))
        ltask.start()
      })
      
      it('should show started', function () {
        ltask.started().should.equal(true)
      })
      
      it('should show completed', function () {
        ltask.completed().should.equal(true)
      })
    })
  })
})