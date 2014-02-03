/* Grunt is an automation tool to make doing some stuff easier - http://gruntjs.com/

For example:
Running tests
Building client-side js
*/

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');

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
  });

  grunt.registerTask('default', 'mochaTest'); // By default run tests
  grunt.registerTask('tests', 'mochaTest');   // Only run tests

};