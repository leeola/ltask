#!/usr/bin/env node
//
// lib/ltask.js
//
// A simple asynch flow library. This is a personal project,
// not intended for mass release.. but use it if you wish.
// Just keep in mind that there may be badgers ahead.
//
// !Note! Currently, this library does not implement any
// actual asynchronous functions. All of the code within
// this library is *synchronous*. This library simply
// helps you chain asynchronous tasks in handy ways.
//
// @copyright 2012 by Lee Olayvar
//
/*jshint asi: true*/



// (task) -> undefined
// 
// Params:
//  task: A function task to execute.
// 
// Desc:
//  A single task entity, with multiple tasks chained before,
//  after, or in parallel with it. Note that this class is
//  designed to be run once and thrown away. To rerun the
//  chain, recreate the chain. Get off my lawn.
function LTask(task_fn) {
  if (task_fn === undefined || task_fn === null)
    this._task_fn = function (next) { next() }
  else
    this._task_fn = task_fn
  
  this._reqs = []
  this._links = []
  this._seqs = []
  this._pars = []
  
  this._task_started = false
  this._task_completed = false
}

// () -> undefined
//
// Desc:
//  Given as the callback to `this._task_fn`, for it to call
//  when it has completed the given tasks.
LTask.prototype._next = function () {
  // Ensure that our seq's never get called, if any linked par's
  // have not completed yet.
  for (var i = 0; i < this._links.length; i++)
    if (this._links[i]._task_completed === false)
      return undefined
  
  // Mark our task as completed
  this._task_completed = true
  
  // Since there are no linked tasks that are not completed,
  // we are a-o-k for starting children processes, so.. do so.
  this._start_children()
  return undefined
}

// () -> undefined
//
// Desc:
//  Start all the children of the task. Children being any task given
//  to this task via `this.seq()`.
LTask.prototype._start_children = function () {
  for (var i = 0; i < this._seqs.length; i++)
    this._seqs[i].start()
  return undefined
}

// (task, link) -> new LTask(task) | task
//
// Params:
//  task: A function or ltask instance.
//  link: If true, the given task's children will not execute
//    until the given task, and *this* task have finished
//    executing. Defaults to false.
//
// Returns:
//  A new ltask, if task is a function, or task itself, if it is
//  not.
//
// Desc:
//  Execute the given function or ltask in parallel with this task.
//  When this task starts, so does the given function task.
LTask.prototype.par = function (task, link) {
  if (typeof(task) == 'function')
    task = new LTask(task)
  
  if (link)
    this._links.push(task)
  else
    this._pars.push(task)
  
  return task
}

// (ltask) -> this
// 
// Params:
//  ltask: An LTask instance
//
// Desc:
//  Require that this ltask is complete before this task gets
//  executed. If this task is started (such as by a par, or seq call)
//  the task will *not* execute, but will instead wait for any
//  tasks it has been req'd to, to finish.
LTask.prototype.req = function (ltask) {
  // Store the ltask as a req, so we can check to make sure this specific
  // ltask has completed, if this.start() is called by something else.
  this._reqs.push(ltask)
  // Add this ltask as a seq'd task. This ensures that when the given
  // ltask is completed, it calls this task.
  ltask.seq(this)
  return this
}

// (task) -> new LTask(task) | task
//
// Params:
//  task: A function or ltask instance
//
// Returns:
//  A new ltask, if task is a function, or task itself, if it is
//  not.
//
// Desc:
//  Execute the given function or ltask after this task is complete.
LTask.prototype.seq = function (task) {
  if (typeof task == 'function')
    task = new LTask(task)
  this._seqs.push(task)
  return task
}

// () -> undefined
//
// Desc:
//  Start this task chain. Note that start will not execute if there
//  are any reqs that have not passed
LTask.prototype.start = function () {
  // Run through the reqs for this ltask. If any have not completed,
  // end this start call. It does not matter, sunny jim.
  for (var i = 0; i < this._reqs.length; i++)
    if (this._reqs[i]._task_completed === false)
      return undefined
  
  // Mark the task as started
  this._task_started = true
  
  // Call our function, and any other pars.. dun dun dunnnn
  this._task_fn(this._next.bind(this))
  for (var i = 0; i < this._pars.length; i++)
    this._pars.start()
  return undefined
}


module.exports = LTask

// Watch out!! It's a badger!