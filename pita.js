var gulp = require( "gulp" );
var uglify = require( "gulp-uglify" );
var rename = require( "gulp-rename" );
var sourcemaps = require( "gulp-sourcemaps" );
var clean = require( "gulp-clean" );

var pita = function pita( script ){
    gulp.task( "clean", function cleanTask( ){
        return gulp.src( "./@script.min.js".replace( "@script", script ) )
            .pipe( clean( { "force": true } ) );
    } );

    gulp.task( "default",
        [ "clean" ],
        function defaultTask( ){
            return gulp.src( "./@script.js".replace( "@script", script ) )
                .pipe( uglify( ) )
                .pipe( rename( "./@script.min.js".replace( "@script", script ) ) )
                .pipe( sourcemaps.write( "./" ) )
                .pipe( gulp.dest( "./" ) );
        } );
};

module.exports = pita;
