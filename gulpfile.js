const gulp          = require("gulp");
const browserSync   = require("browser-sync");
const sass 			= require("gulp-sass");
const rename		= require("gulp-rename");
const autoprefixer  = require("gulp-autoprefixer");
const cleanCSS 		= require("gulp-clean-css");
const htmlmin		= require("gulp-htmlmin");
const image 		= require("gulp-image");

gulp.task("server", function() {
	browserSync.init({
		server: {
			baseDir: "dist"
		}
	});
});

gulp.task("styles", function() {
	return gulp
		   .src("src/sass/styles.sass")
		   .pipe(sass(
			   {
					outputStyle: "compressed"
			   }
		   ).on("error", sass.logError))
		   .pipe(rename({
				prefix: "",
				suffix: ".min",
			}))
		   .pipe(autoprefixer({
				cascade: false
		   }))
		   .pipe(cleanCSS({
			   compatibility: "ie11"
		   }))
		   .pipe(gulp.dest("dist/css"))
		   .pipe(browserSync.stream());
});

gulp.task("htmlmin", function() {
	return gulp
		.src("src/*.html")
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest("dist"))
		.pipe(browserSync.stream());
});

gulp.task("imagemin", function() {
	return	gulp
			.src("src/static/img/**/*")
			.pipe(image())
			.pipe(gulp.dest("dist/static/img"));
});

gulp.task("iconmin", function() {
	return	gulp
			.src("src/static/ico/**/*")
			.pipe(image())
			.pipe(gulp.dest("dist/static/ico"));
});

gulp.task("fonts", function() {
	return gulp
			.src("src/fonts/**/*")
			.pipe(gulp.dest("dist/fonts"));
});

gulp.task("watch", function() {
	gulp.watch("src/sass/**/*.(sass|css|scss)", gulp.parallel("styles"));
	gulp.watch("src/*.html").on("change", gulp.parallel("htmlmin"));
	gulp.watch("src/static/**/*.*").on("change", gulp.parallel("imagemin"));
	gulp.watch("src/static/**/*.*").on("change", gulp.parallel("iconmin"));
});

gulp.task("default", gulp.parallel("watch", "server", "styles", "htmlmin", "imagemin", "iconmin", "fonts"));