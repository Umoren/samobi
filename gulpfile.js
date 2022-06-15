const { src, dest, watch, series, parallel, gulp } = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const purgecss = require('gulp-purgecss')
const connect = require('gulp-connect') // connects to server
const open = require('gulp-open'); // opens browser
const exec = require('child_process').exec; // run command-line programs from gulp
const execSync = require('child_process').execSync; // command-line reports


function openBrowser(done) {
  var options = {
    uri: 'http://localhost:8080/',
  }
  return src('index.html')
    .pipe(open(options))
    done();
}

function server(done) {
  return connect.server({
    root: './',
    port: 8080,
    debug: true,
  })
  done();
}

// Commit and push files to Git
function git(done) {
  return exec('git add . && git commit -m "netlify deploy" && git push');
  done();
}

// Watch for netlify deployment
function netlify(done) {
  return new Promise(function(resolve, reject) {
      console.log(execSync('sudo netlify watch').toString());
      resolve();
  });
}

// Preview Deployment
function netlifyOpen(done) {
  return exec('sudo netlify open:site');
  done();
}


// compiles sass and creates a css directory
function buildStyles() {
  return src('samobi/**/*.scss')
    .pipe(sass())
    .pipe(purgecss({ content: ['*.html']}))
    .pipe(dest('css'))
}

// watches changes in sass files
function watchTask() {
    watch(['samobi/**/*.scss', '*.html'], buildStyles)
}
// Deploy command
exports.deploy = series(git, netlify, netlifyOpen);
exports.default = series(buildStyles, watchTask, openBrowser, server);