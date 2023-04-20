#!/bin/bash
set -eo pipefail

if [[ -z "$PLUGIN_VERSION" ]]; then
	echo "Set the PLUGIN_VERSION env var"
	exit 1
fi

if [[ -z "$CHANNEL" ]]; then
	echo "Set the CHANNEL env var"
	exit 1
fi

if [[ -z "$PACKAGE_VERSION" ]]; then
	echo "Set the PACKAGE_VERSION env var"
	exit 1
fi


ELEMENTOR_PATH="$GITHUB_WORKSPACE/elementor"

cd $ELEMENTOR_PATH
for dir in modules includes data core assets app; do
	if [ ! -d "$dir" ]; then
		echo "Folder $dir does not exist"
		exit 1
	fi
done

if [ ! -f "elementor.php" ]; then
	echo "elementor.php file does not exist"
	exit 1
fi

if [[ $(grep -c "Version: $PLUGIN_VERSION" elementor.php) -eq 0 ]]; then
	echo "elementor.php file does not contain the correct version"
	exit 1
fi

if [[ "$CHANNEL" == "ga" ]]; then
	if [[ $(grep -c "Stable tag: $PACKAGE_VERSION" readme.txt) -eq 0 ]]; then
		echo "readme.txt file does not contain the correct version"
		exit 1
	fi
fi

if [[ "$CHANNEL" == "beta" ]]; then
	if [[ $(grep -c "Beta tag: $PLUGIN_VERSION" readme.txt) -eq 0 ]]; then
		echo "readme.txt file does not contain the correct version"
		exit 1
	fi
fi

#print the version than echo files ls
echo "Version: $PLUGIN_VERSION"
echo "Channel: $CHANNEL"
echo "Package Version: $PACKAGE_VERSION"
echo "Trunk Files:"
ls -la