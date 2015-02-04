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
    copy: {
      main: {
        files: [
        {expand: true, cwd: 'src/', src: ['*'], dest: 'dist/'}
        ]
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
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.registerTask('build',['jshint','copy','uglify','cssmin']);
  grunt.registerTask('test', ['karma']);
};
