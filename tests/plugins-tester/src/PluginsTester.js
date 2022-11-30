import {execSync} from "child_process";

export class PluginsTester {
	options = {
		runServer: true,
		debug: false,
		pluginsToTest: [],
		pwd: '',
		logger: null
	};

	constructor(options) {
		Object.assign(this.options, options);

		this.run();
	}

	async run() {
		if (this.options.runServer) {
			this.setPwd();
			this.runServer();
			this.prepareTestSite();
		}

		this.checkPlugins();
	}

	cmd(cmd) {
		this.options.logger.info('cmd', cmd);
		try {
			const result = execSync(cmd).toString();
			this.options.logger.info('success', result);

			return result;
		} catch (e) {
			throw e;
		}
	};

	runWP(cmd) {
		if ( ! this.options.runServer ) {
			return this.cmd(`cd ../../ && ${cmd}`);
		} else {
			return this.cmd(cmd);
		}
	}

	checkPlugins() {
		const errors = [];
		this.options.pluginsToTest.forEach((slug) => {
			this.runWP(`npx wp-env run cli wp plugin install ${slug} --activate`);

			const siteUrl = this.cmd(`npx wp-env run cli wp option get siteurl`).trim();
			// Some plugins have a welcome message for the first time.
			this.cmd(`curl ${siteUrl}/law-firm-about/?elementor`);
			try {
				this.cmd(`node ./scripts/run-backstop.js --slug=${slug}`);
			} catch (error) {
				this.options.logger.error(error);
				errors.push({
					slug,
					error,
				});
			}

			this.runWP(`npx wp-env run cli wp plugin deactivate ${slug}`);
		});

		this.options.error('errors:', errors);

		if (errors.length) {
			process.exit(1);
		}
	}

	runServer() {
		this.cmd('npm run wp-env start');
	}

	setPwd() {
		this.cmd(`cd ${this.options.pwd}`)
	}

	prepareTestSite() {
		this.cmd(`npx wp-env run cli wp theme activate hello-elementor`);
		try {
			this.cmd(`npx wp-env run cli "wp --user=admin elementor library import-dir /var/www/html/elementor-templates"`);
		} catch (error) {
			this.options.logger.error(error);
		}

		this.cmd(`npx wp-env run cli wp rewrite structure "/%postname%/" --hard`);
		this.cmd(`npx wp-env run cli wp cache flush`);
		this.cmd(`npx wp-env run cli wp rewrite flush --hard`);
		this.cmd(`npx wp-env run cli wp elementor flush-css`);
		this.cmd(`npx wp-env run cli wp post list --post_type=page`);
	}

	cleanup() {
		// Cleanup old reports
		// fs.rmSync( __dirname + '/reports/', { recursive: true, force: true } );
	}
}
