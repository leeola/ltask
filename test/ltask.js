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