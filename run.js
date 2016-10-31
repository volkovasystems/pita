#!/usr/bin/env node

/*;
	@run-module-license:
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
	@end-run-module-license

	@run-module-configuration:
		{
			"package": "pita",
			"path": "pita/run.js",
			"file": "run.js",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/pita.git",
			"shell": "pita",
			"command": "flatten",
			"parameter": [ "script" ]
		}
	@end-run-module-configuration

	@run-module-documentation:
		Run module for the pita module.
	@end-run-module-documentation

	@include:
		{
			"falze": "falze",
			"kept": "kept",
			"Olivant": "olivant",
			"path": "path",
			"yargs": "yargs"
		}
	@end-include
*/

const falze = require( "falze" );
const kept = require( "kept" );
const Olivant = require( "olivant" );
const path = require( "path" );
const yargs = require( "yargs" );

const pita = require( path.resolve( __dirname, "pita" ) );
const package = require( path.resolve( __dirname, "package.json" ) );

let parameter = yargs
	.epilogue( ( package.homepage )?
		`For more information go to, ${ package.homepage }` :
		"Please read usage and examples carefully." )

	.usage( `Usage: ${ package.option.shell } flatten <script>` )

	.command( "flatten <script>",
		"Transform and minify the script to a compact file." )

	.demand( 1, [ "script" ] )

	.example( "$0 flatten module.js",
		"Transform and minify module.js into module.compact.js" )

	.help( "help" )

	.version( function version( ){
		return package.version;
	} )

	.wrap( null )

	.strict( )

	.argv;

let token = parameter._;
let command = token[ 0 ];

if( command != "flatten" ){
	Fatal( "invalid command", command )
		.prompt( );

	return;
}

let script = parameter.script;
if( falze( script ) ){
	Fatal( "script is not given" )
		.prompt( );

	return;
}

script = path.resolve( process.cwd( ), script );

if( !kept( script, READ, true ) ){
	Fatal( "script does not exists", script )
		.prompt( );

	return;
}

pita( script, function done( error, compactFile ){
	if( error ){
		Issue( error )
			.remind( "failed flatten script", script )
			.prompt( );

	}else if( kept( compactFile, READ, true ) ){
		Success( "script flattened", compactFile )
			.prompt( );

	}else{
		Warning( "compact file does not exists" )
			.remind( "failed flatten script", script )
			.prompt( );
	}
} );
