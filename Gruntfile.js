var Compressor = require('node-minify');
module.exports = function(grunt) {
  grunt.initConfig({
    responsive_images: {
      pizza: {
        options: {
          engine: 'im',
          sizes: [{
            width: 160
          }]
        },
        files: [{
          expand: true,
          src: ['before/pizza.jpg'],
          cwd: 'img',
          dest: 'after'
        }]
      }
    },
    pagespeed: {
      options: {
        nokey: true,
        url: "https://nano-degree-performance.herokuapp.com/dist/",
      },
      prod: {
        options: {
          url: "https://nano-degree-performance.herokuapp.com/dist/",
          locale: "en_GB",
          strategy: "desktop",
          threshold: 80
        }
      },
      paths: {
        options: {
          paths: ["/", "/project-2048.html", "/project-webperf.html", "/project-mobile.html", "/pizza.html"],
          locale: "en_GB",
          strategy: "desktop",
          threshold: 80
        }
      }
    }
  });
  function minifyJs(fileIn, fileOut) {
    new Compressor.minify({
      type: 'uglifyjs',
      fileIn: fileIn,
      tempPath: './.tmp/',
      fileOut: './dist/js/' + fileOut,
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
      fileOut: './dist/css/' + fileOut,
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
      './node_modules/materialize-css/bin/materialize.css'
    ], 'vendors.css');
  });

  grunt.registerTask('minify:css:app', function () {
    compressCss(['./after/styles.css'], 'pizza.css');
  });

  grunt.registerTask('minify:js:vendors', function () {
    minifyJs(['./node_modules/jquery/dist/jquery.js',
      './node_modules/underscore/underscore.js',
      './node_modules/q/q.js',
      './node_modules/materialize-css/bin/materialize.js'
      ], 'vendors.js');
  });

  grunt.registerTask('minify:js:app', function () {
    minifyJs(['./after/app.js'], 'app-production.js');
  });


  require('load-grunt-tasks')(grunt);

  grunt.registerTask('production', [
    'minify:css:vendors',
    'minify:css:app',
    'minify:js:vendors',
    'minify:js:app',
    'responsive_images:pizza'
  ]);
};
