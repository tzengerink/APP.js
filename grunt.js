module.exports = function(grunt) {
    'use strict';

    // Configuration
    grunt.initConfig({
        pkg: {
            'name': 'APP.js',
            'author': {
                'name': 'T. Zengerink',
                'email': 't.zengerink@gmail.com'
            },
            'lisence': {
                'type': 'MIT',
                'url': 'https://raw.github.com/Mytho/APP.js/master/LISENCE.md'
            }
        },
        meta: {
            banner: '/*!\n' +
                ' * <%= pkg.name %>\n' +
                ' * Author: <%= pkg.author.name %> (<%= pkg.author.email %>)\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
                ' * <%= pkg.lisence.type %> lisenced, <%= pkg.lisence.url %>\n' +
                ' */'
        },
        clean: {
            folder: 'tmp'
        },
        coffee: {
            app: {
                src: ['src/*.coffee'],
                dest: 'lib/'
            },
            tests: {
                src: ['tests/src/*.coffee'],
                dest: 'tests/lib/'
            }
        },
        concat: {
            app: {
                src: ['lib/*.js'],
                dest: 'tmp/app.js'
            }
        },
        docco: {
            app: {
                src: ['lib/*.js']
            }
        },
        lint: {
            app: [
                'grunt.js',
                'lib/*.js',
                'tests/lib/*.js'
            ]
        },
        min: {
            app: {
                src: ['<banner>', '<config:concat.app.dest>'],
                dest: 'app.min.js'
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
        watch: {
            app: {
                files: ['<config:coffee.app.src>'],
                tasks: 'coffee:app'
            },
            tests: {
                files: ['<config:coffee.tests.src>'],
                tasks: 'coffee:tests'
            }
        }
    });

    // Load Tasks
    grunt.loadNpmTasks('grunt-clean');
    grunt.loadNpmTasks('grunt-coffee');
    grunt.loadNpmTasks('grunt-docco');

    // Default Task
    grunt.registerTask('default', 'coffee lint concat min docco clean');
};
