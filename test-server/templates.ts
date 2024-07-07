import { Config } from './config.js';
import path from 'path';

export const generateDockerComposeYmlTemplate = ( config: Config, basePath: string ) => {
	const mappingsStringArray = Object.keys( config.mappings ).map( ( key ) => {
		const value = config.mappings[ key ];
		return `      - >-
        ${ path.resolve( basePath, value ) }:/var/www/html/${ key }\n`;
	} );
	const pluginsStringArray = Object.keys( config.plugins ).map( ( key ) => {
		const value = config.plugins[ key ];
		return `      - >-
        ${ path.resolve( basePath, value ) }:/var/www/html/wp-content/plugins/${ key }\n`;
	} );
	const themesStringArray = Object.keys( config.themes ).map( ( key ) => {
		const value = config.themes[ key ];
		return `      - >-
        ${ path.resolve( basePath, value ) }:/var/www/html/wp-content/themes/${ key }\n`;
	} );
	const volumes = mappingsStringArray.concat( pluginsStringArray ).concat( themesStringArray ).join( '' );
// 	const volumes = `${ mappingsStr.join( '' ) }
//       - >-
//         /Users/yotams/PhpstormProjects/elementor/build:/var/www/html/wp-content/plugins/elementor
//       - >-
//         /Users/yotams/.wp-env/fdee84940b5ea2ef4346b5d387830a7a/hello-elementor:/var/www/html/wp-content/themes/hello-elementor
//       - >-
//         wpcontent:/var/www/html
// `;
// 	const volumes = `      - >-
//         /Users/yotams/PhpstormProjects/elementor/tests/playwright/templates:/var/www/html/elementor-templates
//       - >-
//         /Users/yotams/PhpstormProjects/elementor/tests/wp-env/config:/var/www/html/elementor-config
//       - >-
//         /Users/yotams/PhpstormProjects/elementor/templates/playwright:/var/www/html/elementor-playwright-templates
//       - >-
//         /Users/yotams/PhpstormProjects/elementor/build:/var/www/html/wp-content/plugins/elementor
//       - >-
//         /Users/yotams/.wp-env/fdee84940b5ea2ef4346b5d387830a7a/hello-elementor:/var/www/html/wp-content/themes/hello-elementor
//       - >-
//         wpcontent:/var/www/html
// `;
	return `services:
  mysql:
    image: 'mariadb:lts'
    ports:
      - '\${WP_ENV_MYSQL_PORT:-}:3306'
    environment:
      MYSQL_ROOT_HOST: '%'
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: wordpress
    volumes:
      - 'mysql:/var/lib/mysql'
#  tests-mysql:
#    image: 'mariadb:lts'
#    ports:
#      - '\${WP_ENV_TESTS_MYSQL_PORT:-}:3306'
#    environment:
#      MYSQL_ROOT_HOST: '%'
#      MYSQL_ROOT_PASSWORD: password
#      MYSQL_DATABASE: tests-wordpress
#    volumes:
#      - 'mysql-test:/var/lib/mysql'
  wordpress:
    depends_on:
      - mysql
    build:
      context: .
      dockerfile: WordPress.Dockerfile
      args: &ref_0
        HOST_USERNAME: yotams
        HOST_UID: '502'
        HOST_GID: '20'
    ports:
      - '\${WP_ENV_PORT:-8888}:80'
    environment:
      APACHE_RUN_USER: '#502'
      APACHE_RUN_GROUP: '#20'
      WORDPRESS_DB_USER: root
      WORDPRESS_DB_PASSWORD: password
      WORDPRESS_DB_NAME: wordpress
      WP_TESTS_DIR: /wordpress-phpunit
    volumes: &ref_1
${ volumes }
    extra_hosts:
      - 'host.docker.internal:host-gateway'
#  tests-wordpress:
#    depends_on:
#      - tests-mysql
#    build:
#      context: .
#      dockerfile: Tests-WordPress.Dockerfile
#      args: *ref_0
#    ports:
#      - '\${WP_ENV_TESTS_PORT:-8889}:80'
#    environment:
#      APACHE_RUN_USER: '#502'
#      APACHE_RUN_GROUP: '#20'
#      WORDPRESS_DB_USER: root
#      WORDPRESS_DB_PASSWORD: password
#      WORDPRESS_DB_NAME: tests-wordpress
#      WORDPRESS_DB_HOST: tests-mysql
#      WP_TESTS_DIR: /wordpress-phpunit
#    volumes: &ref_2
#      - >-
#        /Users/yotams/.wp-env/fdee84940b5ea2ef4346b5d387830a7a/tests-WordPress:/var/www/html
#      - >-
#        /Users/yotams/.wp-env/fdee84940b5ea2ef4346b5d387830a7a/tests-WordPress-PHPUnit/tests/phpunit:/wordpress-phpunit
#      - 'tests-user-home:/home/yotams'
#      - >-
#        /Users/yotams/PhpstormProjects/elementor/tests/playwright/templates:/var/www/html/elementor-templates
#      - >-
#        /Users/yotams/PhpstormProjects/elementor/tests/wp-env/config:/var/www/html/elementor-config
#      - >-
#        /Users/yotams/PhpstormProjects/elementor/templates/playwright:/var/www/html/elementor-playwright-templates
#      - >-
#        /Users/yotams/PhpstormProjects/elementor/build:/var/www/html/wp-content/plugins/build
#      - >-
#        /Users/yotams/.wp-env/fdee84940b5ea2ef4346b5d387830a7a/hello-elementor:/var/www/html/wp-content/themes/hello-elementor
#    extra_hosts:
#      - 'host.docker.internal:host-gateway'
  cli:
    depends_on:
      - wordpress
    build:
      context: .
      dockerfile: CLI.Dockerfile
      args: *ref_0
    volumes: *ref_1
    user: '502:20'
    environment:
      WORDPRESS_DB_USER: root
      WORDPRESS_DB_PASSWORD: password
      WORDPRESS_DB_NAME: wordpress
      WP_TESTS_DIR: /wordpress-phpunit
    extra_hosts:
      - 'host.docker.internal:host-gateway'
#  tests-cli:
#    depends_on:
#      - tests-wordpress
#    build:
#      context: .
#      dockerfile: Tests-CLI.Dockerfile
#      args: *ref_0
#    volumes: *ref_2
#    user: '502:20'
#    environment:
#      WORDPRESS_DB_USER: root
#      WORDPRESS_DB_PASSWORD: password
#      WORDPRESS_DB_NAME: tests-wordpress
#      WORDPRESS_DB_HOST: tests-mysql
#      WP_TESTS_DIR: /wordpress-phpunit
#    extra_hosts:
#      - 'host.docker.internal:host-gateway'
volumes:
  mysql: {}
#  mysql-test: {}
#  user-home: {}
#  tests-user-home: {}
  wpcontent: {}
`;
};

export const generateWordPressDockerfileTemplate = ( config: Config ) => {
	return `FROM wordpress:${ config.core }-php${ config.phpVersion }

# Update apt sources for archived versions of Debian.

# stretch (https://lists.debian.org/debian-devel-announce/2023/03/msg00006.html)
RUN touch /etc/apt/sources.list
RUN sed -i 's|deb.debian.org/debian stretch|archive.debian.org/debian stretch|g' /etc/apt/sources.list
RUN sed -i 's|security.debian.org/debian-security stretch|archive.debian.org/debian-security stretch|g' /etc/apt/sources.list
RUN sed -i '/stretch-updates/d' /etc/apt/sources.list

# Create the host's user so that we can match ownership in the container.
ARG HOST_USERNAME
ARG HOST_UID
ARG HOST_GID
# When the IDs are already in use we can still safely move on.
RUN groupadd -o -g $HOST_GID $HOST_USERNAME || true
RUN useradd -mlo -u $HOST_UID -g $HOST_GID $HOST_USERNAME || true

# Install any dependencies we need in the container.

# Make sure we're working with the latest packages.
RUN apt-get -qy update

# Install some basic PHP dependencies.
RUN apt-get -qy install $PHPIZE_DEPS && touch /usr/local/etc/php/php.ini

# Install git
RUN apt-get -qy install git

# Set up sudo so they can have root access.
RUN apt-get -qy install sudo
RUN echo "#$HOST_UID ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
RUN echo 'upload_max_filesize = 1G' >> /usr/local/etc/php/php.ini
RUN echo 'post_max_size = 1G' >> /usr/local/etc/php/php.ini
RUN curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php
RUN export COMPOSER_HASH=\`curl -sS https://composer.github.io/installer.sig\` && php -r "if (hash_file('SHA384', '/tmp/composer-setup.php') === '$COMPOSER_HASH') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('/tmp/composer-setup.php'); } echo PHP_EOL;"
RUN php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer
RUN rm /tmp/composer-setup.php
USER $HOST_UID:$HOST_GID
ENV PATH="\${PATH}:/home/$HOST_USERNAME/.composer/vendor/bin"
RUN composer global require --dev phpunit/phpunit:"^5.7.21 || ^6.0 || ^7.0 || ^8.0 || ^9.0 || ^10.0"
USER root
`;
};

export const generateCliDockerfileTemplate = ( config: Config ) => {
	return `FROM wordpress:cli-php${ config.phpVersion }

# Switch to root so we can create users.
USER root

# Create the host's user so that we can match ownership in the container.
ARG HOST_USERNAME
ARG HOST_UID
ARG HOST_GID
# When the IDs are already in use we can still safely move on.
RUN addgroup -g $HOST_GID $HOST_USERNAME || true
RUN adduser -h /home/$HOST_USERNAME -G $( getent group $HOST_GID | cut -d: -f1 ) -u $HOST_UID $HOST_USERNAME || true

# Install any dependencies we need in the container.

# Make sure we're working with the latest packages.
RUN apk update

# Install some basic PHP dependencies.
RUN apk --no-cache add $PHPIZE_DEPS && touch /usr/local/etc/php/php.ini

# Set up sudo so they can have root access.
RUN apk --no-cache add sudo linux-headers
RUN echo "#$HOST_UID ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
RUN echo 'upload_max_filesize = 1G' >> /usr/local/etc/php/php.ini
RUN echo 'post_max_size = 1G' >> /usr/local/etc/php/php.ini
RUN curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php
RUN export COMPOSER_HASH=\`curl -sS https://composer.github.io/installer.sig\` && php -r "if (hash_file('SHA384', '/tmp/composer-setup.php') === '$COMPOSER_HASH') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('/tmp/composer-setup.php'); } echo PHP_EOL;"
RUN php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer
RUN rm /tmp/composer-setup.php
USER $HOST_UID:$HOST_GID
ENV PATH="\${PATH}:/home/$HOST_USERNAME/.composer/vendor/bin"
RUN composer global require --dev phpunit/phpunit:"^5.7.21 || ^6.0 || ^7.0 || ^8.0 || ^9.0 || ^10.0"
USER root

# Switch back to the original user now that we're done.
USER www-data

# Have the container sleep infinitely to keep it alive for us to run commands on it.
CMD [ "/bin/sh", "-c", "while true; do sleep 2073600; done" ]
`;
};
