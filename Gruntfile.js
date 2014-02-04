/* Grunt is an automation tool to make doing some stuff easier - http://gruntjs.com/

For example:
Running tests
Building client-side js
*/

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'nyan',
          timeout: '25000ms'
        },
        src: ['server/test/*.js']
      }
    },
    browserify: {
      'app/lib/bundle.js': ['app/app.js']
    },
    watch: {
      files: [ 'app/*.js'],
      tasks: [ 'browserify' ]
    }
  });

  grunt.registerTask('default', ['browserify', 'mochaTest']); // By default run tests
  grunt.registerTask('tests', 'mochaTest');   // Only run tests 
};