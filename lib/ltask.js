#!/usr/bin/env node
//
// ltask.js
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
}

// (task, link) -> this
//
// Params:
//  task: A function or ltask instance.
//  link: If true, the given task's children will not execute
//    until the given task, and *this* task have finished
//    executing.
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
}

// (task) -> this
//
// Params:
//  task: A function or ltask instance
//
// Desc:
//  Execute the given function or ltask after this task is complete.
LTask.prototype.seq = function (task) {
}

// Watch out!! It's a badger!