module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      options: {
        atBegin: true,
        livereload: true
      },
      templates: {
        files: ['*.html'],
        tasks: []
      }
    }
  });

  grunt.event.on('watch', function(action, filepath) {
    console.log(action + ' - ' + filepath);
  });

  var plugins = require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', []);
};
