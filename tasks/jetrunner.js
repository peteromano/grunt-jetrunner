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
        var tasks = this.data,
            done = this.async(),
            instance, tests;

        /**
         * Utility for object configuration "inheritance" (cascading)
         */
        function merge() {
            var obj = arguments[0], args = Array.prototype.slice.call(arguments, 1);

            function copy(destination, source) {
                for (var property in source) {
                    if (source[property] && source[property].constructor &&
                        source[property].constructor === Object) {
                        destination[property] = destination[property] || {};
                        copy(destination[property], source[property]);
                    } else {
                        destination[property] = source[property];
                    }
                }
                return destination;
            }

            for(var i in args) {
                copy(obj, args[i]);
            }

            return obj;
        }

        /**
         * For each JetRunner instance configuration per task (it's rare, but there can be multiple):
         */
        for(var config in tasks) {
            instance  = tasks[config];
            tests     = [];

            /*
             * - Process the instance's client socket driver (PhantomJS, BrowserStack, SauceLabs, etc.) and reporting configuration.
             * - Reporting can be set to whatever Mocha supports.
             */
            instance.client = merge({
                stdout: 'pipe',
                reporter: 'tap'
            }, instance.client);

            /**
             * - Sanitize the input params to jetrunner#run(); as of v1.1, jetrunner#run() takes
             *   an array of tests as its first argument, and an instance configuration as its second, so:
             * - Move `instance.tests` to local var `tests`,
             * - Delete `instance.tests` (just to sanitize the parameter).
             */
            for(var test in instance.tests) tests[test] = instance.tests[test];
            instance.tests = undefined;
            delete instance.tests;

            /**
             * - Pipe JetRunner's <stdout> to Grunt's <stdout> (same for <stderr>),
             * - Use `tests` and `instance` as the arguments tho jetrunner#run(), respectively.
             */
            require('jetrunner')
                .on('phantomjs:stdout', grunt.log.write.bind(grunt.log))
                .on('phantomjs:stderr', grunt.log.error.bind(grunt.log))
                .run(tests, instance, function(code) { done(code === 0); });
        }
    });

};
