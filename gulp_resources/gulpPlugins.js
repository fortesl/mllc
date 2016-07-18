var plugins = {
    browserSync: require('browser-sync'),
    templateCache: require('gulp-angular-templatecache'),
    concat: require('gulp-concat'),
    sass: require('gulp-ruby-sass'),
    jshint: require('gulp-jshint'),
    del: require('del'),
    connect: require('gulp-connect'),
    copy: require('gulp-copy'),
    replace: require('gulp-replace')
};

module.exports = plugins;