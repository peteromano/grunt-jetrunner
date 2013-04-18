/*
 * grunt-jetrunner
 * https://github.com/peteromano/grunt-jetrunner
 *
 * Copyright (c) 2013 Pete Romano
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('jetrunner', 'Unit test server.', function() {
        var tasks       = this.data,
            done        = this.async(),
            jetrunner   = require('jetrunner'),
            noop        = function() {},
            stack       = [],
            tests,
            config;

        function next(code) {
            stack.pop()(code);
        }

        /**
         * For each JetRunner instance configuration per task (it's rare, but there can be multiple):
         */
        for(var cfg in tasks) {
            config  = tasks[cfg];
            tests   = [];

            stack.push(stack.length ? noop : done);

            /**
             * - Sanitize the input params to jetrunner#run(); as of v1.1, jetrunner#run() takes
             *   an array of tests as its first argument, and an instance configuration as its second, so:
             * - Move `config.tests` to local var `tests`,
             * - Delete `config.tests` (just to sanitize the parameter).
             */
            for(var test in config.tests) {
                tests[test] = config.tests[test];
            }

            config.tests = undefined;
            delete config.tests;

            /**
             * - Use `tests` and `config` as the arguments tho jetrunner#run(), respectively.
             */
            jetrunner.run(tests, config, next);
        }
    });

};