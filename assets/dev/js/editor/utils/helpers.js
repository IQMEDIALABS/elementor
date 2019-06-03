var helpers;

helpers = {
	_enqueuedFonts: [],
	_enqueuedIconFonts: [],

	elementsHierarchy: {
		section: {
			column: {
				widget: null,
				section: null,
			},
		},
	},

	enqueueStylesheet( url ) {
		if ( ! elementor.$previewContents.find( 'link[href="' + url + '"]' ).length ) {
			elementor.$previewContents.find( 'link:last' ).after( '<link href="' + url + '" rel="stylesheet" type="text/css">' );
		}
	},

	enqueueIconFonts( iconType ) {
		if ( -1 !== this._enqueuedIconFonts.indexOf( iconType ) ) {
			return;
		}

		const iconSetting = this.getIconLibrarySettings( iconType );
		if ( false === iconType ) {
			return;
		}

		if ( iconSetting.enqueue ) {
			iconSetting.enqueue.forEach( ( assetURL ) => {
				this.enqueueStylesheet( assetURL );
			} );
		}

		if ( iconSetting.url ) {
			this.enqueueStylesheet( iconSetting.url );
		}

		this._enqueuedIconFonts.push( iconType );

		elementor.channels.editor.trigger( 'fontIcon:insertion', iconType, iconSetting );
	},

	getIconLibrarySettings( iconType ) {
		const iconSetting = ElementorConfig.icons.filter( ( library ) => iconType === library.name );
		if ( iconSetting[ 0 ] && iconSetting[ 0 ].name ) {
			return iconSetting[ 0 ];
		}
		return false;
	},

	enqueueFont( font ) {
		if ( -1 !== this._enqueuedFonts.indexOf( font ) ) {
			return;
		}

		const fontType = elementor.config.controls.font.options[ font ],
			subsets = {
				ru_RU: 'cyrillic',
				uk: 'cyrillic',
				bg_BG: 'cyrillic',
				vi: 'vietnamese',
				el: 'greek',
				he_IL: 'hebrew',
			};

		let	fontUrl;

		switch ( fontType ) {
			case 'googlefonts' :
				fontUrl = 'https://fonts.googleapis.com/css?family=' + font + ':100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic';

				if ( subsets[ elementor.config.locale ] ) {
					fontUrl += '&subset=' + subsets[ elementor.config.locale ];
				}

				break;

			case 'earlyaccess' :
				const fontLowerString = font.replace( /\s+/g, '' ).toLowerCase();
				fontUrl = 'https://fonts.googleapis.com/earlyaccess/' + fontLowerString + '.css';
				break;
		}

		if ( ! _.isEmpty( fontUrl ) ) {
			this.enqueueStylesheet( fontUrl );
		}

		this._enqueuedFonts.push( font );

		elementor.channels.editor.trigger( 'font:insertion', fontType, font );
	},

	resetEnqueuedFontsCache() {
		this._enqueuedFonts = [];
		this._enqueuedIconFonts = [];
	},

	getElementChildType( elementType, container ) {
		if ( ! container ) {
			container = this.elementsHierarchy;
		}

		if ( undefined !== container[ elementType ] ) {
			if ( jQuery.isPlainObject( container[ elementType ] ) ) {
				return Object.keys( container[ elementType ] );
			}

			return null;
		}

		for ( const type in container ) {
			if ( ! container.hasOwnProperty( type ) ) {
				continue;
			}

			if ( ! jQuery.isPlainObject( container[ type ] ) ) {
				continue;
			}

			const result = this.getElementChildType( elementType, container[ type ] );

			if ( result ) {
				return result;
			}
		}

		return null;
	},

	getUniqueID() {
		return Math.random().toString( 16 ).substr( 2, 7 );
	},

		let condition,
			conditions;

		// TODO: Better way to get this?
		if ( _.isFunction( controlModel.get ) ) {
			condition = controlModel.get( 'condition' );
			conditions = controlModel.get( 'conditions' );
		} else {
			condition = controlModel.condition;
			conditions = controlModel.conditions;
		}

		// Multiple conditions with relations.
		if ( conditions ) {
			return elementor.conditions.check( conditions, values );
		}

		if ( _.isEmpty( condition ) ) {
			return true;
		}

		var hasFields = _.filter( condition, function( conditionValue, conditionName ) {
			var conditionNameParts = conditionName.match( /([a-z_\-0-9]+)(?:\[([a-z_]+)])?(!?)$/i ),
				conditionRealName = conditionNameParts[ 1 ],
				conditionSubKey = conditionNameParts[ 2 ],
				isNegativeCondition = !! conditionNameParts[ 3 ],
				controlValue = values[ conditionRealName ];

			if ( values.__dynamic__ && values.__dynamic__[ conditionRealName ] ) {
				controlValue = values.__dynamic__[ conditionRealName ];
			}

			if ( undefined === controlValue ) {
				return true;
			}

			if ( conditionSubKey && 'object' === typeof controlValue ) {
				controlValue = controlValue[ conditionSubKey ];
			}

			// If it's a non empty array - check if the conditionValue contains the controlValue,
			// If the controlValue is a non empty array - check if the controlValue contains the conditionValue
			// otherwise check if they are equal. ( and give the ability to check if the value is an empty array )
			var isContains;

			if ( _.isArray( conditionValue ) && ! _.isEmpty( conditionValue ) ) {
				isContains = _.contains( conditionValue, controlValue );
			} else if ( _.isArray( controlValue ) && ! _.isEmpty( controlValue ) ) {
				isContains = _.contains( controlValue, conditionValue );
			} else {
				isContains = _.isEqual( conditionValue, controlValue );
			}

			return isNegativeCondition ? isContains : ! isContains;
		} );

		return _.isEmpty( hasFields );
	},

	cloneObject( object ) {
		elementorCommon.helpers.deprecatedMethod( 'elementor.helpers.cloneObject', '2.3.0', 'elementorCommon.helpers.cloneObject' );

		return elementorCommon.helpers.cloneObject( object );
	},

	firstLetterUppercase( string ) {
		elementorCommon.helpers.deprecatedMethod( 'elementor.helpers.firstLetterUppercase', '2.3.0', 'elementorCommon.helpers.firstLetterUppercase' );

		return elementorCommon.helpers.firstLetterUppercase( string );
	},

	disableElementEvents( $element ) {
		$element.each( function() {
			const currentPointerEvents = this.style.pointerEvents;

			if ( 'none' === currentPointerEvents ) {
				return;
			}

			jQuery( this )
				.data( 'backup-pointer-events', currentPointerEvents )
				.css( 'pointer-events', 'none' );
		} );
	},

	enableElementEvents( $element ) {
		$element.each( function() {
			const $this = jQuery( this ),
				backupPointerEvents = $this.data( 'backup-pointer-events' );

			if ( undefined === backupPointerEvents ) {
				return;
			}

			$this
				.removeData( 'backup-pointer-events' )
				.css( 'pointer-events', backupPointerEvents );
		} );
	},

	getColorPickerPaletteIndex( paletteKey ) {
		return [ '7', '8', '1', '5', '2', '3', '6', '4' ].indexOf( paletteKey );
	},

	wpColorPicker( $element, options ) {
		const self = this,
			colorPickerScheme = elementor.schemes.getScheme( 'color-picker' ),
			items = _.sortBy( colorPickerScheme.items, function( item ) {
				return self.getColorPickerPaletteIndex( item.key );
			} ),
			defaultOptions = {
				width: window.innerWidth >= 1440 ? 271 : 251,
				palettes: _.pluck( items, 'value' ),
			};

		if ( options ) {
			_.extend( defaultOptions, options );
		}

		return $element.wpColorPicker( defaultOptions );
	},

	isInViewport( element, html ) {
		const rect = element.getBoundingClientRect();
		html = html || document.documentElement;
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= ( window.innerHeight || html.clientHeight ) &&
			rect.right <= ( window.innerWidth || html.clientWidth )
		);
	},

	scrollToView( $element, timeout, $parent ) {
		if ( undefined === timeout ) {
			timeout = 500;
		}

		let $scrolled = $parent;
		const $elementorFrontendWindow = elementorFrontend.elements.$window;

		if ( ! $parent ) {
			$parent = $elementorFrontendWindow;

			$scrolled = elementor.$previewContents.find( 'html, body' );
		}

		setTimeout( function() {
			var parentHeight = $parent.height(),
				parentScrollTop = $parent.scrollTop(),
				elementTop = $parent === $elementorFrontendWindow ? $element.offset().top : $element[ 0 ].offsetTop,
				topToCheck = elementTop - parentScrollTop;

			if ( topToCheck > 0 && topToCheck < parentHeight ) {
				return;
			}

			const scrolling = elementTop - ( parentHeight / 2 );

			$scrolled.stop( true ).animate( { scrollTop: scrolling }, 1000 );
		}, timeout );
	},

	getElementInlineStyle( $element, properties ) {
		const style = {},
			elementStyle = $element[ 0 ].style;

		properties.forEach( ( property ) => {
			style[ property ] = undefined !== elementStyle[ property ] ? elementStyle[ property ] : '';
		} );

		return style;
	},

	cssWithBackup( $element, backupState, rules ) {
		const cssBackup = this.getElementInlineStyle( $element, Object.keys( rules ) );

		$element
			.data( 'css-backup-' + backupState, cssBackup )
			.css( rules );
	},

	recoverCSSBackup( $element, backupState ) {
		const backupKey = 'css-backup-' + backupState;

		$element.css( $element.data( backupKey ) );

		$element.removeData( backupKey );
	},

	elementSizeToUnit: function( $element, size, unit ) {
		const window = elementorFrontend.elements.window;

		switch ( unit ) {
			case '%':
				size = ( size / ( $element.offsetParent().width() / 100 ) );
				break;
			case 'vw':
				size = ( size / ( window.innerWidth / 100 ) );
				break;
			case 'vh':
				size = ( size / ( window.innerHeight / 100 ) );
		}

		return Math.round( size * 1000 ) / 1000;
	},

	compareVersions: function( versionA, versionB, operator ) {
		const prepareVersion = ( version ) => {
			version = version + '';

			return version.replace( /[^\d.]+/, '.-1.' );
		};

		versionA = prepareVersion( versionA );
		versionB = prepareVersion( versionB );

		if ( versionA === versionB ) {
			return ! operator || /^={2,3}$/.test( operator );
		}

		const versionAParts = versionA.split( '.' ).map( Number ),
			versionBParts = versionB.split( '.' ).map( Number ),
			longestVersionParts = Math.max( versionAParts.length, versionBParts.length );

		for ( let i = 0; i < longestVersionParts; i++ ) {
			const valueA = versionAParts[ i ] || 0,
				valueB = versionBParts[ i ] || 0;

			if ( valueA !== valueB ) {
				return elementor.conditions.compare( valueA, valueB, operator );
			}
		}
	},
};

module.exports = helpers;
