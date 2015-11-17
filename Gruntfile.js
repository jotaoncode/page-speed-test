var Compressor = require('node-minify');
module.exports = function(grunt) {
  grunt.initConfig({
    responsive_images: {
      all: {
        options: {
          engine: 'im',
          sizes: [{
            width: 73
          }, {
            width: 160,
            quality: 50
          }]
        },
        files: [{
          expand: true,
          src: ['pizzeria.jpg', 'me.png', 'image.png'],
          cwd: './before/',
          dest: 'after'
        }]
      }
    },
    pagespeed: {
      options: {
        nokey: true,
        url: "https://jotaoncode.herokuapp.com/pagespeedtest",
        threshold: 90
      },
      paths: {
        options: {
          paths: ["/before/index.html", "/after/index.html"],
          locale: "en_GB",
          strategy: "desktop",
          threshold: 90
        }
      }
    }
  });
  function minifyJs(fileIn, fileOut) {
    new Compressor.minify({
      type: 'uglifyjs',
      fileIn: fileIn,
      tempPath: './.tmp/',
      fileOut: './after/js/' + fileOut,
      callback: function (err) {
        if (err) {
          console.log('Uglifyjs Something goes wrong: ' + err);
          return;
        }
        console.log('Compressed all in js.');
      }
    });
  }
  function compressCss(fileIn, fileOut) {
    new Compressor.minify({
      type: 'yui-css',
      fileIn: fileIn,
      tempPath: './.tmp/',
      fileOut: './after/css/' + fileOut,
      callback: function (err) {
        if (err) {
          console.log('YUI-CSS Something goes wrong: ' + err);
          return;
        }
        console.log('Compressed all in css.');
      }
    });
  }
  grunt.registerTask('minify:css:vendors', function () {
    compressCss([
      './node_modules/materialize-css/dist/css/materialize.min.css'
    ], 'vendors.css');
  });

  grunt.registerTask('minify:css:app', function () {
    compressCss(['./before/styles.css'], 'app-production.css');
  });

  grunt.registerTask('minify:js:vendors', function () {
    minifyJs(['./node_modules/jquery/dist/jquery.min.js',
      './node_modules/underscore/underscore-min.js',
      './node_modules/q/q.js',
      './node_modules/materialize-css/dist/js/materialize.min.js'
      ], 'vendors.js');
  });

  grunt.registerTask('minify:js:app', function () {
    minifyJs(['./before/app.js'], 'app-production.js');
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [
    'minify:css:vendors',
    'minify:css:app',
    'minify:js:vendors',
    'minify:js:app',
    'responsive_images:all'
  ]);
};
