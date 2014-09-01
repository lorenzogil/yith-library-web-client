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
        bower: {
            install: {
                options: {
                    targetDir: './yithwebclient/static/vendor',
                    cleanTargetDir: true
                }
            }
        },
        concat: {
            options: {
                separator: ';',
                process: function (src, filepath) {
                    // Remove ALL block comments, the stripBanners only removes
                    // the first one
                    src = src.replace(/\/\*[\s\S]*?\*\//g, '');
                    return '\n\n// Source: ' + filepath + '\n' + src;
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
                    'yithwebclient/static/js/list-views.js',
                    'yithwebclient/static/js/edit-views.js'
                ],
                dest: 'yith-<%= pkg.version %>.js'
            },
            vendor: {
                src: [
                    'yithwebclient/static/vendor/jquery/jquery.js',
                    'yithwebclient/static/vendor/bootstrap/bootstrap.js',
                    'yithwebclient/static/vendor/pwstrength-bootstrap/pwstrength-bootstrap-1.2.1.js',
                    'yithwebclient/static/vendor/handlebars/handlebars.js',
                    'yithwebclient/static/vendor/ember/ember.js',
                    // FIXME concat this file makes uglify crash
                    // 'yithwebclient/static/vendor/ember-data/ember-data.js',
                    'yithwebclient/static/vendor/sjcl/sjcl.js'
                ],
                dest: 'vendor.js'
            }
        },
        uglify: {
            options: {
                banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> - AGPLv3 License */\n',
                sourceMap: true,
                sourceMapName: 'yith-<%= pkg.version %>.min.map'
            },
            dist: {
                files: {
                    'yith-<%= pkg.version %>.min.js': [
                        '<%= concat.dist.dest %>'
                    ]
                }
            },
            vendor: {
                files: {
                    'vendor.min.js': [
                        '<%= concat.vendor.dest %>'
                    ]
                }
            }
        },
        shell: {
            makeDir: {
                command: 'mkdir -p yithwebclient/static/js/prod'
            },
            moveVendorFiles: {
                command: 'mv vendor* yithwebclient/static/js/prod/'
            },
            moveFiles: {
                command: 'mv yith-<%= pkg.version %>* yithwebclient/static/js/prod/'
            },
            makeFontDir: {
                command: 'mkdir -p yithwebclient/static/vendor/fonts'
            },
            mvFonts: {
                command: 'mv yithwebclient/static/vendor/fontawesome/FontAwesome.otf yithwebclient/static/vendor/fontawesome/*webfont* yithwebclient/static/vendor/fonts/'
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('test', ['jslint']);

    // Default task(s)
    grunt.registerTask('default', ['jslint', 'bower', 'concat', 'uglify',
                                   'shell']);
};
