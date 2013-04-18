/*
 * grunt-jetrunner
 * https://github.com/peteromano/grunt-jetrunner
 *
 * Copyright (c) 2013 Pete Romano
 * Licensed under the MIT license.
 */

'use strict';

var jetrunner = {

    "config": {

        "tests": [
            { "/example/test/adder_test.js":        "/example/src/adder.js" },
            { "/example/test/divider_test.js":      "/example/src/divider.js" },
            { "/example/test/multiplier_test.js":   "/example/src/multiplier.js" }
        ],

        "runner": {
            "base": "node_modules/jetrunner",
            "styles": ["/example/vendor/mocha/mocha.css"],
            "scripts": [
                "/example/vendor/json3/lib/json3.min.js",
                "/example/vendor/mocha/mocha.js",
                "/example/vendor/sinon/sinon.js"
            ]
        },

        "saucelabs": {
            "driver": "saucelabs",
            "reportFile": "node_modules/jetrunner/example/reports/saucelabs.tap",
            "key": "1ebab6ce-c188-486f-86dd-3cc1957f2435",
            "username": "peteromano",
            "password": "j3trvnz3r",
            "continueOnFail": true,
            "maxParallel": 2,
            "tunnel": {
                "enabled": true,
                "path": "/usr/local/opt/Sauce-Connect-latest/Sauce-Connect.jar",
                "readyFile": "node_modules/jetrunner/example/log/sauce_connect.log",
                "fastFailRegexps": ["favicon.ico"]
            },
            "browsers": [
                // https://saucelabs.com/docs/platforms
                {"browser": "googlechrome", "os": "OS X 10.8", "browser-version": ""},
                {"browser": "safari", "os": "OS X 10.8", "browser-version": "6"},
                {"browser": "firefox", "os": "Windows 8", "browser-version": "20"},
                {"browser": "googlechrome", "os": "Windows 7", "browser-version": ""},
                {"browser": "firefox", "os": "Windows 7", "browser-version": "20"},
                {"browser": "iehta", "os": "Windows 7", "browser-version": "9"},
                {"browser": "iehta", "os": "Windows 7", "browser-version": "8"},
                {"browser": "googlechrome", "os": "Windows XP", "browser-version": ""},
                {"browser": "firefox", "os": "Windows XP", "browser-version": "20"},
                {"browser": "googlechrome", "os": "Linux", "browser-version": ""},
                {"browser": "firefox", "os": "Linux", "browser-version": "20"}
            ]
        }

    }

};

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    "jetrunner": {
        "phantomjs": [{
            "tests":    jetrunner.config.tests,
            "runner":   jetrunner.config.runner
        }],
        "saucelabs": [{
            "tests":    jetrunner.config.tests,
            "runner":   jetrunner.config.runner,
            "client":   jetrunner.config.saucelabs
        }]
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'jetrunner', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
