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
    },

    connect: {
      demo: {
        options: {
          port: 3003,
          livereload: true,
          maxAge: -1
        }
      }
    }
  });

  grunt.event.on('watch', function(action, filepath) {
    console.log(action + ' - ' + filepath);
  });

  var plugins = require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', []);
  grunt.registerTask('demo', ['connect', 'watch']);

  grunt.event.once('connect.demo.listening', function(host, port) {
    var url = 'http://' + host + ':' + port;
    grunt.log.writeln('demo running at: ' + url);
    require('open')(url);
  });
};
