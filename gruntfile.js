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
      main: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['Chrome']
      }
    }
  });

  // provide --autoWatch to stop karma from closing the browser => debug the test
  var autoWatch = grunt.option('autoWatch') || false;
  grunt.config('karma.main.singleRun',!autoWatch);

  // provide --browser parameter to specify browser name
  var browser = grunt.option('browser') || 'Chrome';
  browser = browser.toLowerCase();
  if (browser==='phantom' || browser==='phantomjs'){
    browser='PhantomJS';
  }else{
    browser='Chrome';
  }
  grunt.config('karma.main.browsers',[browser]);

  grunt.registerTask('build',['jshint','ngtemplates','concat','clean','uglify','cssmin']);
  grunt.registerTask('test', ['karma']);
};
