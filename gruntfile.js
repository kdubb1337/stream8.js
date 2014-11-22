'use strict';

module.exports = function(grunt) {
	// Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-closure-compiler');

	// Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths
    var config = {
        app: 'src',
        dist: 'dist',
        port: "9000"
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,

        gruntfile: {
            files: ['gruntfile.js']
        },

        // Karma test settings
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },

		// Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

		// The actual grunt server settings
        connect: {
            options: {
                port: config.port,
                open: {
                    target: 'http://localhost:9000' // target url to open
                },
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: '*'
            },
            test: {
                options: {
                    open: false,
                    base: 'test',
                    port: 9001,
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect.static('test'),
                            connect().use('/bower_components', connect.static('./bower_components')),
                            connect.static(config.app)
                        ];
                    }
                }
            }
        },

        'closure-compiler': {
            frontend: {
                closurePath: 'C:/Dev/github/closure-compiler',
                js: '<%= config.app %>/stream8.js',
                jsOutputFile: '<%= config.dist %>/stream8.min.js',
                maxBuffer: 500,
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS',
                    // compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT'
                }
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: ["*.*", "**/*.*"]
                }]
            }
        }
    });

	grunt.registerTask('build', function(target) {
        grunt.task.run([
            'test',
            'clean:dist',
            'copy:dist',
            'closure-compiler',
        ]);
    });

    grunt.registerTask('test', function(target) {
        if (target !== 'watch') {
            grunt.task.run([
                'clean:server'
            ]);
        }
        grunt.task.run([
            // 'connect:test',
            'karma:unit'
        ]);
    });
};