var gulp = require( "gulp" );
var uglify = require( "gulp-uglify" );
var rename = require( "gulp-rename" );
var sourcemaps = require( "gulp-sourcemaps" );
var del = require( "del" );
var vinylPaths = require( "vinyl-paths" );
var fs = require( "fs" );
var path = require( "path" );

var pita = function pita( script ){
	var scriptPath = "@script.js".replace( "@script", script );
	var minifiedScriptPath = "@script.min.js".replace( "@script", script );

	var pathSteps = "./";
	while( !fs.existsSync( path.resolve( pathSteps, scriptPath ) ) ){
		pathSteps = "../" + pathSteps;
	}

	gulp.task( "clean", function cleanTask( ){
		console.log( "cleaning previous script version ", path.resolve( pathSteps, minifiedScriptPath ) );
		return gulp.src( path.resolve( pathSteps, minifiedScriptPath ) )
			.pipe( vinylPaths( del ) );
	} );

	gulp.task( "default",
		[ "clean" ],
		function defaultTask( ){
			console.log( "flattening script ", path.resolve( pathSteps, scriptPath ) );
			return gulp.src( path.resolve( pathSteps, scriptPath ) )
				.pipe( sourcemaps.init( ) )
				.pipe( uglify( ) )
				.pipe( rename( minifiedScriptPath ) )
				.pipe( sourcemaps.write( pathSteps ) )
				.pipe( gulp.dest( pathSteps ) );
		} );
};

module.exports = pita;
