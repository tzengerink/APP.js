module.exports = function(grunt) {

    // Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        coffee: {
            compile: {
                files: {
                    'build/app.js': 'build/app.coffee',
                    'build/tests.js': 'build/tests.coffee'
                }
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
                options: {
                    output: 'docs'
                },
                src: ['build/app.coffee']
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'build/app.js', 'build/tests.js'],
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
                'strict'    : false,
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
        uglify: {
            options: {
                banner: '/*!\n' +
                    ' * <%= pkg.name %> v<%= pkg.version %>\n' +
                    ' * - - -\n' +
                    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
                    ' * Released under <%= pkg.lisence.type %> lisenced\n' +
                    ' * <%= pkg.lisence.url %>\n' +
                    ' */\n'
            },
            app: {
                files: {
                    'app.min.js': ['<banner>', 'build/app.js']
                }
            },
            tests: {
                files: {
                    'tests/tests.min.js': ['build/tests.js']
                }
            }
        },
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
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-docco');

    // Default Task
    grunt.registerTask('default', ['concat', 'coffee', 'jshint', 'uglify', 'docco']);

};
