#!/bin/bash
set -eox pipefail
whoami
WP_CLI_CACHE_DIR=/tmp wp plugin install "$1" --activate
