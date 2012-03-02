#!/usr/bin/env node
//
// lib/ltask.js
//
// A simple asynch flow library. This is a personal project,
// not intended for mass release.. but use it if you wish.
// Just keep in mind that there may be badgers ahead.
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
// after, or in parallel with it.
function LTask(task_fn) {
  this._task_fn = task_fn
  
  this._reqs = []
  this._links = []
  
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
  
  // Since the conditions are a-o-k for running the next processes.. do so.
  this._start_children()
}


LTask.prototype._start_children = function () {
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
  
}

// Watch out!! It's a badger!