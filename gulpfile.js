var gulp = require('gulp');
var path = require('path');
var sources = require('./gulp_resources/sourceFiles');
var plugins = require('./gulp_resources/gulpPlugins');

var resourceFolders = {
    templates: './src/templates/',
    styles: './src/styles/',
    scripts: './src/scripts/',
    buildJs: './dist/logic/',
    buildStyles: './dist/css/'
//    deployJs: '../Scripts/Markdown/llc',
//    deployStyles: '../Scripts/Markdown/llc/css/'
};

gulp.task('build', ['buildThirdPartyJs', 'buildNgTemplates', 'buildAppJs', 'buildStyle']);

//gulp.task('deploy', ['deployThirdPartyJs', 'deployNgTemplates', 'deployAppJs', 'deployStyle']);

gulp.task('dev', ['lint', 'serve', 'watch']);

gulp.task('watch', function () {
    gulp.watch(sources.app.concat('./src/templates/**/*.html'), ['lint', 'buildNgTemplates', 'buildAppJs']);
    gulp.watch('./src/styles/**/*.scss', ['buildStyle']);
});

gulp.task('buildAppJs', function () {
    return gulp.src(sources.app)
        .pipe(plugins.concat('markdownLlc.js'))
        .pipe(gulp.dest(resourceFolders.buildJs));
});

gulp.task('buildNgTemplates', function () {
    return gulp.src('./src/templates/**/*.html')
        .pipe(plugins.templateCache('markdownLlc.templates.js', { module: 'Markdownllc' }))
        .pipe(gulp.dest(resourceFolders.buildJs));
});


gulp.task('buildThirdPartyJs', function () {
    return gulp.src(sources.libs.js)
        .pipe(plugins.concat('thirdParty.js'))
        .pipe(gulp.dest(resourceFolders.buildJs));
});

gulp.task('buildStyle', ['sass'], function () {
    return gulp.src(sources.libs.css.concat('./.tmp/css/app.css'))
        .pipe(plugins.concat('markdownLlc.css'))
        .pipe(gulp.dest(resourceFolders.buildStyles));
});

/* NOT APPLICABLE yet =====================
gulp.task('deployAppJs', function () {
    return gulp.src(resourceFolders.buildJs + 'markdownLlc.js')
        .pipe(plugins.copy(resourceFolders.deployJs, { prefix: 4 }));
});

gulp.task('deployThirdPartyJs', function () {
    return gulp.src(resourceFolders.buildJs + 'thirdParty.js')
        .pipe(plugins.copy(resourceFolders.deployJs, { prefix: 4 }));
});

gulp.task('deployNgTemplates', function () {
    return gulp.src(resourceFolders.buildJs + 'markdownLlc.templates.js')
        .pipe(plugins.copy(resourceFolders.deployJs, { prefix: 4 }));
});

gulp.task('deployStyle', function () {
    return gulp.src(resourceFolders.buildStyles + '*.css')
        .pipe(plugins.copy(resourceFolders.deployStyles, { prefix: 4 }));
});  ================ */

gulp.task('serve', function () {
    plugins.browserSync({
        server: {
            baseDir: './'
        },
        files: [resourceFolders.buildStyles + '*.css', resourceFolders.buildJs + '*.js']
    });

});

gulp.task('sass', function () {
    return plugins.sass('./src/styles/app.scss', { loadPath: ['./bower_components/bootstrap-sass/assets/stylesheets'] })
        .pipe(gulp.dest('./.tmp/css'));
});

gulp.task('lint', function () {
    return gulp.src('src/scripts/llc/**/*.js')
        .pipe(plugins.jshint({ lookup: false }))
        .pipe(plugins.jshint.reporter('default'));
});

gulp.task('clean', function (cb) {
    plugins.del(['./dist', './.sass-cache', './.tmp'], cb);
});

gulp.task('default', ['dev']);

