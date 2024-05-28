const { src, dest, parallel, series, watch } = require("gulp");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const purgecss = require("gulp-purgecss");
const sass = require("sass");
const scss = require("gulp-sass")(sass);
const browserSync = require("browser-sync").create();

const path = {
  src: {
    scss: ["./scss/*.scss"],
    js: "",
  },
  dest: {
    css: "./src/css/",
    js: "./src/js/",
  },
};

function style() {
  return src(path.src.scss)
    .pipe(sourcemaps.init())
    .pipe(scss({ outputStyle: "compressed" }).on("error", scss.logError))
    .pipe(sourcemaps.write("/map/"))
    .pipe(dest(path.dest.css))
    .pipe(browserSync.stream());
}
function mover() {
  return src(["./node_modules/font-awesome/fonts/**"]).pipe(
    dest("./src/fonts/")
  );
}
function watcher() {
  browserSync.init({
    server: {
      baseDir: "./src",
    },
  });
  watch(path.src.scss, style);
  return watch("./src/**/*.{html,js}").on("change", browserSync.reload);
}

exports.style = style;
exports.move = mover;
exports.default = series(mover, watcher);
