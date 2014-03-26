/* Grunt is an automation tool to make doing some stuff easier - http://gruntjs.com/

For example:
Running tests
Building client-side js
*/

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-compass');

  grunt.initConfig({
    compass: {
      dist: {
        options: {
          cssDir: 'server/static/css',
          imagesDir: 'server/static/images',
          sassDir: 'app/sass'
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'nyan'
        },
        src: ['test/**/*.spec.js']
      }
    },
    browserify: {
      'server/static/lib/bundle.js': ['app/app.js'],
      options: {
        transform: ['hbsfy'],
        // detectGlobals: false,
        // cache: true,
        // debug: false
      }
    },
    watch: {
      files: [ 'app/*.js', 'app/**/*.js', 'app/**/**/*.hbs', 'app/**/*.scss'],
      tasks: [ 'browserify', 'compass' ],
      options: {
        spawn: false,
        debounceDelay: 100,
        livereload: true,
        hostname: 'localhost',
        atBegin: true
      }
    }
  });

  grunt.registerTask('heroku:production', ['browserify', 'compass']);
  grunt.registerTask('default', ['browserify', 'compass']); // By default run tests
  grunt.registerTask('tests', 'mochaTest');   // Only run tests 
  grunt.registerTask('build', ['browserify', 'compass', 'mochaTest']);
  grunt.registerTask('heroku:production', 'browserify, compass');
};