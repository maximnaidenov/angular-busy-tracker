'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    jshint: {
      main: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'src/busy.js'
      }
    },
    ngtemplates:  {
      main: {
        options:{
          module: 'mnBusy',
          concat: 'main',
          url: function(url) {
            return 'mnBusy/' + url.replace('src/', '');
          },
          htmlmin: {
            collapseWhitespace: true
          }
        },
        src: 'src/*.html',
        dest: 'dist/templates.js'
      }
    },
    concat: {
      main: {
        files: [
          {src: 'src/busy.js',dest: 'dist/busy.js'},
          {src: 'src/*.css',dest: 'dist/busy.css'}
        ]
      }
    },
    clean: {
      main: {
        src: 'dist/templates.js'
      }
    },
    uglify: {
      main: {
        files: [
          {src: 'dist/busy.js',dest: 'dist/busy.min.js'}
        ]
      }
    },
    cssmin: {
      main: {
        files: [
          {expand: true,cwd: 'dist',src: ['*.css', '!*.min.css'],dest: 'dist',ext: '.min.css'}
        ]
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        singleRun: true
      },
      debug: {
        singleRun: false
      }
    }
  });

  grunt.registerTask('build',['jshint','ngtemplates','concat','clean','uglify','cssmin']);
  grunt.registerTask('test', ['karma:unit']);
  grunt.registerTask('test-debug', ['karma:debug']);
};
