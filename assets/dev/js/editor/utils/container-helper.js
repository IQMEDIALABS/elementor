/**
 * Container element helper functions.
 */
export class ContainerHelper {
	// Flex directions.
	static DIRECTION_ROW = 'row';
	static DIRECTION_COLUMN = 'column';
	static DIRECTION_ROW_REVERSED = 'row-reverse';
	static DIRECTION_COLUMN_REVERSED = 'column-reverse';

	/**
	 * Create multiple container elements.
	 *
	 * @param {Number} count - Count of Containers to create.
	 * @param {Object} settings - Settings to set to each Container.
	 * @param {Container} target - The Container object to create the new Container elements inside.
	 * @param {Object} options - Additional command options.
	 *
	 * @return {Container[]} - Array of the newly created Containers.
	 */
	static createContainers( count, settings, target = {}, options = {} ) {
		const containers = [];

		for ( let i = 0; i < count; i++ ) {
			containers.push( this.createContainer( settings, target, options ) );
		}

		return containers;
	}

	/**
	 * Create a Container element.
	 *
	 * @param {Object} settings - Settings to set to each Container.
	 * @param {Container} target - The Container object to create the new Container elements inside.
	 * @param {Object} options - Additional command options.
	 *
	 * @return {Container} - The newly created Container.
	 */
	static createContainer( settings = {}, target, options = {} ) {
		return $e.run( 'document/elements/create', {
			container: target,
			model: {
				elType: 'container',
				settings,
			},
			options,
		} );
	}

	/**
	 * Change Container settings.
	 *
	 * @param {Object} settings - New settings.
	 * @param {Container} container - Container to set the settings to.
	 *
	 * @return {void}
	 */
	static setContainerSettings( settings, container ) {
		$e.run( 'document/elements/settings', {
			container,
			settings,
			options: {
				external: true,
			},
		} );
	}

	/**
	 * Create a Container element based on a preset.
	 *
	 * @param {string} preset
	 * @param {Container} [target=elementor.getPreviewContainer()]
	 * @param {Object} [options={}]
	 * @param {Boolean} [options.createWrapper=true] - Create a wrapper container for the preset.
	 *
	 * @returns {Container} - Container created on.
	 */
	static createContainerFromPreset( preset, target = elementor.getPreviewContainer(), options ) {
		let newContainer,
			settings;

		const historyId = $e.internal( 'document/history/start-log', {
				type: 'add',
				title: __( 'Container', 'elementor' ),
			} ),
			{ createWrapper = true } = options;

		try {
			switch ( preset ) {
				// Single Container without sub Containers.
				case '100':
					newContainer = ContainerHelper.createContainer( {}, target, options );
					break;

				// Exceptional preset.
				case 'c100-c50-50':
					settings = {
						flex_direction: ContainerHelper.DIRECTION_ROW,
						flex_wrap: 'wrap',
						flex_gap: {
							unit: 'px',
							size: 0, // Set the gap to 0 to override the default inherited from `Site Settings`.
						},
					};

					if ( ! createWrapper ) {
						$e.run( 'document/elements/settings', { container: target, settings } );
						newContainer = target;
					} else {
						newContainer = ContainerHelper.createContainer( settings, target, options );
					}

					settings = {
						width: {
							unit: '%',
							size: '50',
						},
						width_mobile: {
							unit: '%',
							size: '100',
						},
					};

					ContainerHelper.createContainer( settings, newContainer, { edit: false } );

					const rightContainer = ContainerHelper.createContainer( {
						...settings,
						padding: { size: '' }, // Create the right Container with 0 padding (default is 10px) to fix UI (ED-4900).
						flex_gap: {
							unit: 'px',
							size: 0, // Set the gap to 0 to override the default inherited from `Site Settings`.
						},
					}, newContainer, { edit: false } );

					ContainerHelper.createContainers( 2, {}, rightContainer, { edit: false } );

					break;

				// Containers by preset.
				default:
					const sizes = preset.split( '-' ),
						// Map rounded, user-readable sizes to actual percentages.
						sizesMap = {
							33: '33.3333',
							66: '66.6666',
						};

					settings = {
						flex_direction: this.DIRECTION_ROW,
						flex_wrap: 'wrap',
						flex_gap: {
							unit: 'px',
							size: 0, // Set the gap to 0 to override the default inherited from `Site Settings`.
						},
					};

					// Create a parent container to contain all of the sub containers.
					let parentContainer;

					if ( ! createWrapper ) {
						$e.run( 'document/elements/settings', {
							container: target,
							settings,
						} );

						parentContainer = target;
					} else {
						parentContainer = this.createContainer( settings, target, options );
					}

					// Create all sub containers using the sizes array.
					// Use flex basis to make the sizes explicit.
					sizes.forEach( ( size ) => {
						size = sizesMap[ size ] || size;

						this.createContainer( {
							flex_direction: this.DIRECTION_COLUMN,
							width: {
								unit: '%',
								size,
							},
							width_mobile: { // For out-of-the-box responsiveness.
								unit: '%',
								size: '100',
							},
						}, parentContainer, { edit: false } );
					} );

					newContainer = parentContainer;
			}

			$e.internal( 'document/history/end-log', { id: historyId } );
		} catch ( e ) {
			$e.internal( 'document/history/delete-log', { id: historyId } );
		}

		return newContainer;
	}

	/**
	 * Open edit mode of a Container.
	 *
	 * @param {Container} container - Container to open edit mode for.
	 *
	 * @return void
	 */
	static openEditMode( container ) {
		$e.run( 'panel/editor/open', {
			model: container.model,
			view: container.view,
			container,
		} );
	}
}

export default ContainerHelper;
