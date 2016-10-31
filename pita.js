"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2016 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "pita",
			"path": "pita/pita.js",
			"file": "pita.js",
			"module": "pita",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/pita.git",
			"test": "pita-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Script minifier using gulp. Based from the Greek word for flat bread.
	@end-module-documentation

	@include:
		{
			"async": "async",
			"babel": "gulp-babel",
			"called": "called",
			"del": "del",
			"gulp": "gulp",
			"kept": "kept",
			"path": "path",
			"rename": "gulp-rename",
			"snapd": "snapd",
			"sourcemap": "gulp-sourcemaps",
			"uglify": "gulp-uglify",
			"vinylFS": "vinyl-fs",
			"vinylPath": "vinyl-paths"
		}
	@end-include
*/

const babel = require( "gulp-babel" );
const called = require( "called" );
const del = require( "del" );
const kept = require( "kept" );
const path = require( "path" );
const rename = require( "gulp-rename" );
const series = require( "async" ).series;
const snapd = require( "snapd" );
const sourcemap = require( "gulp-sourcemaps" );
const uglify = require( "gulp-uglify" );
const vinylFS = require( "vinyl-fs" );
const vinylPath = require( "vinyl-paths" );

var pita = function pita( script, callback ){
	callback = called(callback);

	let name = script.match( /([a-zA-Z0-9\-\_]+)\.js$/ )[ 1 ];
	let compactName = `${ name }.compact.js`;
	let compactFile = script.replace( /[a-zA-Z0-9\-\_]+\.js$/, compactName );
	let directory = script.split( /[a-zA-Z0-9\-\_]+\.js$/ )[ 0 ];

	series( [
		function clean( callback ){
			callback = called( callback );

			if( !kept( compactFile, READ, true ) ){
				callback( );

				return;
			}

			vinylFS.src( compactFile )
				.on( "end", callback )
				.on( "error", callback )
				.pipe( vinylPath( del ) );
		},

		function flatten( callback ){
			callback = called(callback);

			vinylFS.src( script )
				.on( "end", callback )
				.on( "error", callback )
				.pipe( sourcemap.init( ) )
				.pipe( babel( { "presets": [ "es2015", "react" ] } ) )
				.pipe( uglify( ) )
				.pipe( rename( compactName ) )
				.pipe( sourcemap.write( ) )
				.pipe( vinylFS.dest( directory ) );
		},

		function delay( callback ){
			snapd( callback, 1000 );
		} ],

		function lastly( error ){
			callback( error, compactFile );
		} );

	return compactFile;
};

module.exports = pita;
