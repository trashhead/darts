module.exports = function (grunt) {

  "use strict";

  var angularModul = 'app';
  var srcDir = 'app';
  var buildDir = "build";
  var testDir = 'test';
  var testOutputDir = 'test_out';
  var bowerDir = "bower_components";
  

  grunt.initConfig({

    clean: {
      build: [buildDir],
      test: [testOutputDir],
    },

    ngtemplates: {
      dist: {
        cwd: srcDir,
        src: ['templates/*.html'],
        dest: "temp" + '/templates.js',
        options: {
          module: angularModul
        }
      }
    },
    copy: {
      index: {
        files: [{
          src: 'app/index.html',
          dest: buildDir + '/index.html'
        }]
      },
    css:{
      files: [{
        cwd: 'app/',
        src: 'css/**/*.css',
        dest: buildDir,
        expand:true
      }]
    },
    images:{
      files: [{
        cwd: 'app/',
        src: 'images/**/*.*',
        dest: buildDir,
        expand:true
      },{
        cwd: 'app/',
        src: ['*.ico', '*.png'],
        dest: buildDir,
        expand:true
      }]
    },
      bower: {
        files: [{
          cwd: '.',
          src: ['bower_components/**/*'],
          dest: buildDir,
          expand: true
        }]
      }
    },
    concat: {
      build: {
        src: [
          srcDir + '/**/*.js',
          '!'+srcDir+'/bower_components/**/*',
          "temp" + '/templates.js'
        ],
        dest: buildDir + '/all.js',
        options: {
          banner: '(function(){\n\'use strict\';\n\n',
          footer: '\n\n}());',
      sourceMap:true
        }
      },
    css: {
        src: [
          srcDir + '/**/*.css'
        ],
        dest: buildDir + '/all.css'
      }
    },
    watch: {
      options: {
        interrupt: true,
        livereload: true, //ersätts av portPick
      },
      index: {
        files: [ srcDir + '/index.html' ],
        tasks: [ 'copy:index' ],
      },
      js: {
        files: [ srcDir + '/**/*.js', '!' + bowerDir + '/**/*' , 'env.js'],
        tasks: [ 'concat:build' ],
      },
      html: {
        files: [ srcDir + '/**/*.html'],
        tasks: [ 'ngtemplates', 'concat:build' ],
      },
      //less: {
       // files: [ srcDir + '/less/**/*.less'],
      //  tasks: [ 'less' ],
      //},
      test: {
        files: [ testDir + '/**/*.spec.js' ],
        tasks: [ 'test' ],
      }
    }

  });

  require('load-grunt-tasks')(grunt);
  //require('time-grunt')(grunt);

  grunt.registerTask('build', [
    //  'wiredep:develop',
    'ngtemplates',
      'concat',
    /*'less',*/
       'copy'
  ]);

  grunt.registerTask('test:unit', [
    'clean:test',
    'jshint',
    'wiredep:test',
    'portPick:karma',
    'karma:unit'
  ]);

  grunt.registerTask('test:browsers', [
    'clean:test',
    'wiredep:test',
    'portPick:karma',
    'karma:browsers'
  ]);

  grunt.registerTask('test:ci', [
    'clean:test',
    'wiredep:test',
    'portPick:karma',
    'force:karma:ci'
  ]);

  grunt.registerTask('test', ['test:unit']);

  grunt.registerTask('develop', [
    'wiredep:develop',
    'configureProxies:server',
    'connect',
    'watch'
  ]);
  grunt.registerTask('dev', [
    'ngtemplates',
    'concat',
    'copy',
    'watch'
  ]);

  grunt.registerTask('default', [
    'clean',
    'build'/*,
    'test:ci'*/
  ]);
};
