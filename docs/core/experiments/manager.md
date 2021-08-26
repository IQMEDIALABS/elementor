# Experiments Manager

Since some of Elementor's features are still being worked on, and to avoid any potential issues,
Elementor has given the users an option of switching them on and off and testing how they impact the site.
The users will be able to try out these features in a safe environment and influence future releases.

## Product Knowledge Base:

- [Elementor Experiments - Developers Center](https://developers.elementor.com/elementor-experiments/)


- [Elementor Experiments - Help Center](https://elementor.com/help/features/experiments/)


- [Introducing experiments in Elementor 3.1](https://elementor.com/blog/introducing-elementor-3-1/)


## Technical Description:

This is the Experiments Manager of Elementor. It registers and manages all the experimental features in Elementor.

Each module (`Elementor\Core\Base\Module`) can register its own experiments using the static `get_experimental_data()` method:

```PHP
// modules/admin-top-bar/module.php

public static function get_experimental_data() {
	return [
		'name' => 'admin-top-bar',
		'title' => __( 'Admin Top Bar', 'elementor' ),
		'description' => __( 'Adds a top bar to elementor pages in admin area.', 'elementor' ),
		'release_status' => Elementor\Core\Experiments\Manager::RELEASE_STATUS_BETA,
		'new_site' => [
			'default_active' => true,
		],
	];
}
```

In addition, you can "talk" directly to the manager in order to register an experiment using `\Elementor\Plugin::instance()->experiments->add_feature()`:

```PHP
// core/experiments/manager.php

\Elementor\Plugin::instance()->experiments->add_feature( [
	'name' => 'a11y_improvements',
	'title' => __( 'Accessibility Improvements', 'elementor' ),
	'description' => __( 'Accessibility Improvements Description', 'elementor' ),
	'release_status' => Elementor\Core\Experiments\Manager::RELEASE_STATUS_BETA,
	'new_site' => [
		'default_active' => true,
		'minimum_installation_version' => '3.1.0-beta',
	],
] );
```

Using both of the above methods, you can set the experiment name, description, release status (alpha, beta, dev, etc.),
default state (active / inactive) and more! You can even pass a callback to run when the feature state has changed! 
(using the `on_state_change` key in the experiment settings array).

Then, in order to check whether the experiment is active or not, you can ask the manager:

### PHP:
```php
Plugin::instance()->experiments->is_feature_active( 'your-feature-name' );

// OR in the Pro version:

Plugin::elementor()->experiments->is_feature_active( 'your-feature-name' );
```

### JS:
```js
elementorCommon.config.experimentalFeatures[ 'your-feature-name' ];

// OR in frontend pages:

elementorFrontend.config.experimentalFeatures[ 'your-feature-name' ];
```


## Attention Needed / Known Issues:

- Make sure to load your assets ONLY WHEN THE EXPERIMENT IS ACTIVE, or it might cause unexpected behaviors and will send
  unnecessary code to the end-user (which in turn will slow down the website and ruin the user experience).
  

- Handle the release status & default state carefully - you don't want to break production with an untested alpha-state feature.

  As a rule of thumb - Don't ship alpha features as active by default. 


- You can also register a default experiment (usually a core code which doesn't have a dedicated module) using the
  `add_default_features()` method in the `core/experiments/manager.php` file.


___

See also:

- [Webpack Dynamic Imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports)
  

- [Webpack and Dynamic Imports: Doing it Right](https://medium.com/front-end-weekly/webpack-and-dynamic-imports-doing-it-right-72549ff49234)


- [What are Dynamic Imports and how to use them?](https://www.initialyze.com/blog/2020/11/what-are-dynamic-imports-and-how-to-use-them/)
