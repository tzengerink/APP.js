module.exports = function(grunt) {
    'use strict';

    // Configuration
    grunt.initConfig({
        coffee: {
            app: {
                src: ['build/app.coffee'],
                dest: 'build/'
            },
            tests: {
                src: ['build/tests.coffee'],
                dest: 'build/'
            }
        },
        concat: {
            app: {
                src: ['src/*.coffee'],
                dest: 'build/app.coffee'
            },
            tests: {
                src: ['tests/src/*.coffee'],
                dest: 'build/tests.coffee'
            }
        },
        docco: {
            app: {
                src: ['build/app.coffee']
            }
        },
        jshint: {
            options: {
                'bitwise'   : true,
                'browser'   : true,
                'camelcase' : true,
                'curly'     : true,
                'eqeqeq'    : true,
                'forin'     : true,
                'immed'     : true,
                'indent'    : 4,
                'latedef'   : true,
                'maxerr'    : 50,
                'newcap'    : true,
                'noarg'     : true,
                'noempty'   : true,
                'nonew'     : true,
                'onevar'    : true,
                'plusplus'  : false,
                'quotmark'  : 'single',
                'regexp'    : true,
                'strict'    : true,
                'trailing'  : true,
                'undef'     : true,
                'unused'    : true,
                'white'     : false,
                'predef'    : [
                    'APP',
                    'deepEqual',
                    'equal',
                    'expect',
                    'module',
                    'ok',
                    'test'
                ]
            }
        },
        lint: {
            app: [
                'grunt.js',
                'build/app.js',
                'build/tests.js'
            ]
        },
        meta: {
            banner: '/*!\n' +
                ' * <%= pkg.name %> v<%= pkg.version %>\n' +
                ' * - - -\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
                ' * Released under <%= pkg.lisence.type %> lisenced\n' +
                ' * <%= pkg.lisence.url %>\n' +
                ' */'
        },
        min: {
            app: {
                src: ['<banner>', 'build/app.js'],
                dest: 'app.min.js'
            },
            tests: {
                src: ['build/tests.js'],
                dest: 'tests/tests.min.js'
            }
        },
        pkg: '<json:package.json>',
        watch: {
            app: {
                files: ['<config:coffee.app.src>'],
                tasks: 'concat:app coffee:app'
            },
            tests: {
                files: ['<config:coffee.tests.src>'],
                tasks: 'concat:tests coffee:tests'
            }
        }
    });

    // Load Tasks
    grunt.loadNpmTasks('grunt-coffee');
    grunt.loadNpmTasks('grunt-docco');

    // Default Task
    grunt.registerTask('default', 'concat coffee lint min docco');
};
