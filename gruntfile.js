'use strict';

module.exports = function(grunt) {
	// Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

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
        }
    });

	grunt.registerTask('serve', function(target) {
        grunt.task.run([
            'clean:server',
            'injector',
            'concurrent:server',
            'less',
            'autoprefixer',
            'connect:livereload',
            'watch'
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