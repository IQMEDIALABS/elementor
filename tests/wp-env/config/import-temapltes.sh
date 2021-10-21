#!/bin/bash
set -eox pipefail

wp theme activate hello-elementor
wp elementor library import_dir /var/www/html/wp-content/plugins/elementor/tests/lighthouse/templates --user=admin

WP_CLI_CONFIG_PATH=elementor-config/wp-cli.yml wp rewrite structure \"/%postname%/\" --hard
wp elementor flush-css
wp post list --post_type=page
