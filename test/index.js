#!/usr/bin/env node
//
// test/index.js
//
// Our main test file. Run this with node, and watch all the vows do stuff.
//
// @copyright 2012 by Lee Olayvar
//
/*jshint asi: true*/

var tests = [
  require('./ltask')
]

if (require.main == module) {
  for (var i = 0; i < tests.length; i++) {
    var suites = tests[i]
    Object.keys(suites).forEach(function (suite_key) {
      suites[suite_key].run()
    })
  }
}