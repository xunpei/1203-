var gulp = require('gulp');
var sass = require("gulp-sass");
var mincss = require("gulp-clean-css");
var uglify = require("gulp-uglify");
var babel = require("gulp-babel");
var server = require("gulp-webserver");
var concat = require("gulp-concat");

//编译并压缩css
gulp.task("scss", function() {
    return gulp.src("./src/scss/style.scss")
        .pipe(sass())
        .pipe(mincss())
        .pipe(gulp.dest("./src/css"))
})


//起服务
gulp.task("server", function() {
    return gulp.src("src")
        .pipe(server({
            port: 9090,
            livereload: true,
            middleware: function(req, res, next) {
                if (req.url === "/favicon.ico") {
                    return res.end();
                }
                var pathname = require("url").parse(req.url).pathname;

                pathname = pathname === "/" ? "index.html" : pathname;
                res.end(require("fs").readFileSync(require("path").join(__dirname, "src", pathname)));
            }
        }))
})
gulp.task("js", function() {
        return gulp.src("./src/js/**/*/js")
            .pipe(concat("all.js"))
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(gulp.dest("./src/js/myjs"))
    })
    // gulp.task("wjs", function() {
    //     return gulp.watch(, series("js"))
    // })
gulp.task("watch", function() {
    return gulp.watch(["./src/scss/style.scss", "./src/js/myjs/script.js"], gulp.series("scss", "js"))
})

gulp.task("default", gulp.parallel("js", "scss", "server", "watch"))