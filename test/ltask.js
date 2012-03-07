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
  
  describe('#par', function () {
    
    describe('par a task, start the root', function () {
      beforeEach(function () {
        var starting_ltask = new LTask()
        ltask = new LTask()
        starting_ltask.par(ltask)
        starting_ltask.start()
      })
      
      it('should show started', function () {
        ltask.started().should.equal(true)
      })
      
      it('should show completed', function () {
        ltask.completed().should.equal(true)
      })
    })
    
    describe('par a task, start the child', function () {
      beforeEach(function () {
        var starting_ltask = new LTask()
        ltask = new LTask()
        ltask.par(starting_ltask)
        starting_ltask.start()
      })
      
      it('should show started', function () {
        ltask.started().should.equal(true)
      })
      
      it('should show completed', function () {
        ltask.completed().should.equal(true)
      })
    })
    
    describe('link a task, start the root', function () {
      var par_task
        , link_task
        , seq_task
      
      beforeEach(function () {
        par_task = new LTask()
        link_task = new LTask()
        seq_task = new LTask()
        
        // Call par, make sure link is on.
        par_task.par(link_task, true)
        link_task.seq(seq_task)
        
        new LTask(par_task).start()
      })
      
      it('par should show started and completed', function () {
        par_task.started().should.equal(true)
        par_task.completed().should.equal(true)
      })
      
      it('link should show started and completed', function () {
        par_task.started().should.equal(true)
        par_task.completed().should.equal(true)
      })
      
      it('seq should show started and completed', function () {
        par_task.started().should.equal(true)
        par_task.started().should.equal(true)
      })
    })
    
    describe('link to a task that never finishes, start the root', function () {
      var par_task
        , link_task
        , seq_task
      
      beforeEach(function () {
        // The par task never finishes, so seq (which is linked to
        // .. link) should never be started.
        par_task = new LTask(function () {})
        link_task = new LTask()
        seq_task = new LTask()
        
        // Call par, make sure link is on.
        par_task.par(link_task, true)
        link_task.seq(seq_task)
        
        new LTask(par_task).start()
      })
      
      it('par should show started, but not completed', function () {
        par_task.started().should.equal(true)
        par_task.completed().should.equal(false)
      })
      
      it('link should show started and completed', function () {
        par_task.started().should.equal(true)
        par_task.completed().should.equal(true)
      })
      
      // This is the key. Our linked task should have completed, but
      // it should *not* call our seq task.
      it('seq should show not started and not completed', function () {
        par_task.started().should.equal(false)
        par_task.started().should.equal(false)
      })
    })
  })
  
  describe('#req', function () {
    
    describe('req an unfinishing task', function () {
      beforeEach(function () {
        ltask = new LTask()
        ltask.req(new LTask(function () {}))
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
        var finishing_task = new LTask(function (next) { next() })
        ltask.req(finishing_task)
        
        finishing_task.start()
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
  
  describe('#seq', function () {
    var seq
    
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
})