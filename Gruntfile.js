module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      options: {
        atBegin: true,
        livereload: false,
        reload: false,
        spawn: false,
        nospawn: true
      },
      ngTemplates: {
        options: {
          livereload: true
        },
        files: ['todos.html', 'demo.css'],
        tasks: []
      }
    },

    'http-server': {
      demo: {
        root: '.',
        port: 3003,
        cache: -1,
        runInBackground: true
      }
    }
  });

  grunt.event.on('watch', function(action, filepath) {
    console.log(action + ' - ' + filepath);
  });

  grunt.registerTask('open', function () {
    var url = 'http://localhost:3003';
    grunt.log.writeln('demo running at: ' + url);
    require('open')(url);
  });


  var plugins = require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', []);
  grunt.registerTask('demo', ['http-server:demo', 'open', 'watch:ngTemplates']);

  grunt.event.once('http-server.demo.listening', function(host, port) {

  });
};
