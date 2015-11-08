var Compressor = require('node-minify');
module.exports = function(grunt) {
  grunt.initConfig({
    responsive_images: {
      all: {
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
        url: "https://jotaoncode.herokuapp.com/news/optimizations/pagespeed/test/",
      },
      paths: {
        options: {
          paths: ["/before/index.html", "/after/index.html"],
          locale: "en_GB",
          strategy: "mobile",
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
      './node_modules/materialize-css/bin/materialize.css'
    ], 'vendors.css');
  });

  grunt.registerTask('minify:css:app', function () {
    compressCss(['./after/styles.css'], 'app-production.css');
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

  grunt.registerTask('default', [
    'minify:css:vendors',
    'minify:css:app',
    'minify:js:vendors',
    'minify:js:app'
  ]);
};
