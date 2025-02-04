const {src, dest, series, watch}  = require('gulp')


const autoprefixer = require('gulp-autoprefixer')
const cleanCss = require('gulp-clean-css')
const clean = require('gulp-clean')
const concat = require('gulp-concat')
const imageMin = require('gulp-image')
const gulpPug = require('gulp-pug')
const gulpSass = require('gulp-sass')
const dartSass  = require('sass')
const gulpUglify = require('gulp-uglify')

const sass = gulpSass(dartSass)

const browserSync = require('browser-sync')

const srcFolder = "./src"
const buildFolder = "./app"

const cleanBuild = () => {
  return src(`${buildFolder}/**/`)
    .pipe(clean())
}

//images
function images() {
  return src(`${srcFolder}/img/**.{png,PNG,jpg,JPG,jpeg,ico,webp,mp4,webm}`, {encoding: false})
    .pipe(imageMin())
    .pipe(dest(`${buildFolder}/img`))
    .pipe(browserSync.stream())
}

//styles
function styles () {
  return src(`${srcFolder}/sass/**/*.sass`)
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(concat('main.css'))
    .pipe(dest(`${buildFolder}/css`))
    .pipe(concat('main.min.css'))
    .pipe(cleanCss())
    .pipe(dest(`${buildFolder}/css`))
    .pipe(browserSync.stream())
}

//scripts
function scripts () {
  return src([`${srcFolder}/js/**/*.js`, `${srcFolder}/js/*.js`])
    .pipe(concat('main.js'))
    .pipe(dest(`${buildFolder}/js`))
    .pipe(concat('main.min.js'))
    .pipe(gulpUglify())
    .pipe(dest(`${buildFolder}/js`))
    .pipe(browserSync.stream())
}

//html
function html() {
  return src(`${srcFolder}/pug/components/**/*.pug`)
    .pipe(gulpPug())
    .pipe(dest(`${buildFolder}`))
}

function watchFiles () {
  browserSync.init({
    server: {
      baseDir: buildFolder
    }
  }),

  watch(`${srcFolder}/js/**/*.js`, scripts)
  watch(`${srcFolder}/sass/**/*.sass`, styles)
  watch(`${srcFolder}/pug/**/*.pug`, html)
  watch(`${srcFolder}/img/**.{png,PNG,jpg,JPG,jpeg,ico,webp,mp4,webm}`, images)
}

exports.default = series(
  cleanBuild,
  styles,
  scripts,
  html,
  images,
  watchFiles,
)