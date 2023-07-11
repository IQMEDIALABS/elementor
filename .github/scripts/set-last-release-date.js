const { Octokit } = require( "@octokit/rest" );
const octokit = new Octokit( {
	auth: process.env.token,
	// auth: "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",
} )

const { repository_id, environment_name, name, value } = process.env;

console.log( 'process.env', process.env );

(async () => {
	octokit.rest.actions.updateEnvironmentVariable( {
		// repository_id,
		// environment_name,
		// name,
		// value,
		repository_id: '431095051',
		environment_name: 'SCHEDULE_RELEASES',
		name: 'LAST_AUTOMATED_RELEASE',
		value: '2023-10-01T00:00:00Z',
	} );
} )()
