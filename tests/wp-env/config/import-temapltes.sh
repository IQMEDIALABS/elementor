#!/bin/bash
set -eox pipefail

wp theme activate hello-elementor

ls /var/www/html/elementor-templates
ls /var/www/html/wp-content/plugins/
ls /var/www/html/wp-content/plugins/build/tests/lighthouse/

WP_CLI_CONFIG_PATH=elementor-config/wp-cli.yml wp rewrite structure \"/%postname%/\" --hard
wp elementor flush-css
wp post list --post_type=page
