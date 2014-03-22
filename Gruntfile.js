/*jslint node: true */
/*global */

module.exports = function (grunt) {
    "use strict";

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jslint: { // configure the task
            client: {
                src: [
                    'yithwebclient/static/js/*js', 'Gruntfile.js'
                ],
                directives: {
                    browser: true,
                    predef: [
                        'Ember'
                    ]
                }
            }
        },
        concat: {
            options: {
                process: function (src, filepath) {
                    // Remove ALL block comments, the stripBanners only removes
                    // the first one
                    src = src.replace(/\/\*[\s\S]*?\*\//g, '');
                    return '// Source: ' + filepath + src;
                }
            },
            dist: {
                src: [
                    'yithwebclient/static/js/app.js',
                    'yithwebclient/static/js/objects.js',
                    'yithwebclient/static/js/models.js',
                    'yithwebclient/static/js/controllers.js',
                    'yithwebclient/static/js/edit-controllers.js',
                    'yithwebclient/static/js/views.js',
                    'yithwebclient/static/js/list-views.js'
                ],
                dest: 'yith-<%= pkg.version %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> - AGPLv3 License */\n',
                sourceMap: 'yith-<%= pkg.version %>.min.map'
            },
            dist: {
                files: {
                    'yith-<%= pkg.version %>.min.js': [
                        '<%= concat.dist.dest %>'
                    ]
                }
            }
        },
        shell: {
            makeDir: {
                command: 'mkdir -p yithwebclient/static/js/prod'
            },
            moveFiles: {
                command: 'mv yith-<%= pkg.version %>* yithwebclient/static/js/prod/'
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('test', ['jslint']);

    // Default task(s)
    grunt.registerTask('default', ['jslint', 'concat', 'uglify', 'shell']);
};
