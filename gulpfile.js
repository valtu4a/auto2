'use strict';
// подключение плагинов
const gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    htmlmin = require('gulp-htmlmin'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

//пути
const path={
    build:{
        html:"build/",
        scss:"build/css/",
        js:"build/js/",
        fonts:"build/fonts/",
        img:"build/img/"
    },
    src:{
        html:"src/*.{htm,html}",
        scss:"src/scss/main.scss",
        js:"src/js/**/*.js",
        fonts:"src/fonts/*.*",
        img:"src/img/*.*"
    },
    watch:{
        html:"src/*.{htm,html}",
        scss:"src/scss/**/*.scss",
        js:"src/js/**/*.js",
        fonts:"src/fonts/*.*",
        img:"src/img/*.*"
    },
    clean:'build/'
},
    config = {
    server: {
        baseDir: "./build", // base directory
        index:"index.html", // start page
    },
    tunnel: true, // tunnel
    //proxy: 'donate.local', // for php and xampp vhosts
    host: 'localhost',
    port: 7787,
    logPrefix: "WebDev"
};

//описание задач

// копировать в папку src исходников из загруженного пакета
gulp.task('mv:bootstrap_scss',function (done) {
    gulp.src('node_modules/bootstrap/scss/**/*.scss')
        .pipe(gulp.dest('src/scss/bootstrap'));
    done();
});

gulp.task('mv:bootstrap_js',function (done) {
    gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.js')
        .pipe(gulp.dest('src/js/'));
    done();
});


/**
* Задачи обработки
**/

gulp.task('build:html',function (done) {
    gulp.src(path.src.html)
        .pipe(htmlmin({collapseWhitespace:true}))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream:true}));
    done();

});

gulp.task('build:scss',function (done) {
    gulp.src(path.src.scss)
        .pipe(sass({outputStyle:'expanded'}))
        .pipe(prefixer())
        .pipe(gulp.dest(path.build.scss))
        .pipe(reload({stream:true}));
    done();
});

gulp.task('watch',function (done) {
    gulp.watch(path.watch.html, gulp.series('build:html'));
    gulp.watch(path.watch.scss, gulp.series('build:scss'));
    done();
});

gulp.task('webserver',function (done) {
    browserSync(config);
    done();
});

gulp.task('src', gulp.parallel('mv:bootstrap_scss','mv:bootstrap_js'));

gulp.task('default', gulp.series('src', gulp.parallel('build:html','build:scss'),'watch','webserver'));