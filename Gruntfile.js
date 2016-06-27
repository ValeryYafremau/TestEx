module.exports = function (grunt) {
    grunt.initConfig({
        coffee: {
          dist: {
            files: [{
              expand: true,
              cwd: './',
              src: ['{,*/}*.coffee'],
              dest: 'js/',
              ext: '.js',
              extDot: 'last'
            }]
          }
        },
        mochaTest: {
          test: {
            options: {
              reporter: 'spec'
            },
            src: ['js/test/**/*test.js']
          }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['coffee', 'mochaTest']);

};
