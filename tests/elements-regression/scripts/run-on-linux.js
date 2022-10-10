const { spawn, exec } = require( 'child_process' );
const packageJson = require( '../../../package.json' );

function isDockerExist() {
	return new Promise( ( resolve ) => {
		exec( 'docker -v', ( error ) => {
			resolve( ! error );
		} );
  } );
}

async function run( args ) {
	const playwrightVersion = packageJson.devDependencies[ '@playwright/test' ];
	const workingDir = process.cwd();

	const command = 'docker run';
	const options = [
		'--rm',
		'--network host',
		`--volume ${ workingDir }:/work`,
		'--workdir /work/',
		'--interactive',
		'--tty',
	];
	const image = `mcr.microsoft.com/playwright:v${ playwrightVersion }-focal`;
	const commandToRun = `/bin/bash -c "npm i && npm run test:elements-regression -- ${ args.join( ' ' ) }"`;

	spawn( `${ command } ${ options.join( ' ' ) } ${ image } ${ commandToRun }`, {
		stdio: 'inherit',
		stderr: 'inherit',
		shell: true,
	} );
}

( async () => {
	if ( ! await isDockerExist() ) {
		console.error( 'Docker is not installed, please install it first.' );

		process.exit( 1 );
	}

	await run( process.argv.slice( 2 ) );
} )();
