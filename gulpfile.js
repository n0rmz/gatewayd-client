"use strict";

var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var packageConfig = require('./package.json');
var NAME = packageConfig.name;
var PORT = packageConfig['dev-port'];
var posix = require('posix');

// todo: clean this up and modularize with variable file name/path
// handle secrets. Make npm module for this in the future
var secrets = {};

if (fs.existsSync('./secrets.json')) {
  secrets = require('./secrets.json');
}

var getSecret = function(key) {
  if (secrets[key]) {
    return secrets[key];
  }

  return false;
};
// end secrets

var chalk = require('chalk');
var gulp = require('gulp');
var shell = require('gulp-shell');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var merge = require('merge-stream');
var webpack = require('gulp-webpack');
var del = require('del');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sequence = require('run-sequence');
var gulpif = require('gulp-if');
var flags = require('minimist')(process.argv.slice(2));
var plumber = require('gulp-plumber');
var debug = require('gulp-debug');

// message formatting
var error = chalk.bold.red;
var warning = chalk.bold.yellow;
var info = chalk.black.bgMagenta;
var message = chalk.bold.black.bgGreen;

var logBanner = function(message) {
  if (message) {
    return [
      '======= '+ message + ' =======',
    ].join('\n');
  } else {
    return '====================\n';
  }
};

// prod build
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');

// environment flags
var isProduction = flags.production || false;
var watching = flags.watch || false;

//server
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');

// todo: clean up and standardize config
var paths = (function() {
  var root = path.join(__dirname),
      devDir = "dist",
      prodDir = "build",
      scripts = "app/scripts/",
      styles = "app/styles/",
      setPath;

  setPath = function() {
    var args = Array.prototype.slice.call(arguments);

    args.unshift(root);

    return  path.join.apply(this, args);
  };

  return {
    sass: setPath(styles, '**/*.scss'),
    html: setPath('app/*.html'),
    main_js: setPath(scripts, 'main.jsx'),
    js: setPath(scripts, '**/*.js'),
    jsx: setPath(scripts, '**/*.jsx'),
    json: setPath(scripts, '**/*.json'),
    fonts: setPath('./app/libs/bootstrap-sass-official/assets/fonts/**/*.{ttf,woff,eot,svg}'),
    dist: setPath(devDir),
    devBuild: {
      fonts: setPath(devDir, 'fonts'),
      styles: setPath(devDir, 'styles'),
      html: setPath(devDir),
      scripts: setPath(devDir, 'scripts')
    },
    prodBuild: {
      dir: setPath(prodDir),
      name: 'archive.tar'
    },
    deploy: {
      dir: '/srv/' + NAME,
      buildDir: prodDir,
      releaseDir: '/releases',
      currentDir: '/current'
    }
  };
})();


// build
// todo: clean this up, abstract the sequnce calls and args to config
// in future use methods to DRY this up
gulp.task('build', function(callback) {

  console.log(
    message(
      logBanner('Building ' + (flags.production ? 'production' : 'dev'))
    )
  );

  if (watching) {
    sequence(
      ['ulimitCheck', 'clean'],
      [
        'copy',
        'connect',
        'sass',
        'js'
      ],
      'watch',
      function() {
        console.log(info(logBanner("Watching...")));
      });
  } else if (isProduction) {
    sequence(
      ['ulimitCheck', 'clean'],
      [
        'copy',
        'sass',
        'js'
      ],
      'archive',
      function() {
        console.log(message(logBanner("Build Completed")));
        process.exit(0);
      });
    }
});


// scripts
gulp.task('ulimitCheck', function(cb) {
  var nlimit = posix.getrlimit('nofile').soft;

  if (!(_.isNull(nlimit)) && nlimit < 2048) {
    console.log(info(logBanner('ulimit -n is currently only ' + nlimit)));
    console.log(info(logBanner('Please run "ulimit -n 2048" to ensure resources for node processes')));
  }

  cb();
});

gulp.task('clean', function(cb) {
  return del([paths.prodBuild.dir, paths.dist], cb);
});

gulp.task('copy', function() {
  var fonts, index;

  fonts = gulp.src(paths.fonts)
          .pipe(gulp.dest(paths.devBuild.fonts));

  index = gulp.src(paths.html)
          .pipe(gulp.dest(paths.devBuild.html));

  return merge(fonts, index);
});

gulp.task('sass', function() {
  return gulp
    .src([paths.sass])
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: isProduction ? 'compressed' : 'nested'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    //.pipe(debug({verbose: true, title: "SASS LOG"}))
    .pipe(gulp.dest(paths.devBuild.styles));
});

// build bundle.js
gulp.task('js', function() {
  console.log("js Build Start");

  // bundle the JS
  return gulp.src(paths.main_js)
    .pipe(webpack({
      eslint: {
        configFile: './.eslintrc'
      },
      context: __dirname + '/app',
      contentBase: __dirname,
      resolve: {
        root: __dirname,
        modulesDirectories: ['app', 'node_modules']
      },
      module: {
        loaders: [
          {test: /\.json$/, exclude: /node_modules/, loader: 'json-loader'},
          {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
          {test: /\.jsx?$/, exclude: /node_modules/, loader: 'eslint-loader'}
        ]
      },
      output: {
        filename: 'bundle.js'
      }
    }))
    //.pipe(debug({verbose: true}))
    .pipe(gulpif(isProduction, uglify()))
    .pipe(gulp.dest(paths.devBuild.scripts));
});

gulp.task('archive', function() {
  return gulp.src(path.join(paths.dist, '**'))
    .pipe(tar(paths.prodBuild.name))
    .pipe(gzip())
    .pipe(gulp.dest(paths.prodBuild.dir));
});

gulp.task('connect', function() {
  connect.server({
    root: paths.dist,
    port: PORT || 8080
  });
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  livereload.listen();

  //gulp watch uses 'gaze' - paths must be relative
  //let's address this later

  gulp.watch('./app/styles/**/*.scss', ['sass']);
  gulp.watch('./app/*.html', ['copy']);
  gulp.watch('./app/scripts/**/*.js', ['js']);
  gulp.watch('./app/i18n/**/*.js', ['js']);
  gulp.watch('./app/scripts/**/*.jsx', ['js']);
  gulp.watch('./app/scripts/**/*.json', ['js']);
  gulp.watch('./app-config.json', ['js']);
  gulp.watch('./dist/' + '**/*.{html,css,js}').on('change', function(event) {
    if (event.type === 'changed') {
      console.log(info("===========watch triggered============"), arguments);
      livereload.changed(event);
    }
  });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', function() {
  gulp.start('build');
});
