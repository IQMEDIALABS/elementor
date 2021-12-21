import ComponentBase from 'elementor-api/modules/component-base';
import * as commands from './commands/';
import * as commandsInternal from './commands-internal/';

export default class Component extends ComponentBase {
	getNamespace() {
		return 'document/elements';
	}

	defaultCommands() {
		return this.importCommands( commands );
	}

	defaultCommandsInternal() {
		return this.importCommands( commandsInternal );
	}

	defaultStates() {
		return {
			'': {
				initialState: {},
				reducers: {
					add: ( state, { payload } ) => {
						// Prepare
						const { containerId, models = [ payload.model ], index = 0 } = payload,
							parent = state[ containerId ];

						// Act
						for ( const model of models.reverse() ) {
							// Store the newly created element
							state[ model.id ] = model;

							// Create reference on parent element
							if ( parent ) {
								parent.elements.splice( index, 0, model.id );
							}
						}
					},
					remove: ( state, { payload } ) => {
						// Prepare
						const { containerIds = [ payload.containerId ], parentId } = payload,
							parent = state[ parentId ];

						// Act
						for ( const containerId of containerIds ) {
							// Remove current element
							delete state[ containerId ];

							// Remove reference from parent element
							if ( parent ) {
								parent.elements.splice( parent.elements.indexOf( containerId ), 1 );
							}
						}

						return state;
					},
					settings: ( state, { payload } ) => {
						// Prepare
						const { containerIds = [ payload.containerId ], settings } = payload;

						// Act
						for ( const containerId of containerIds ) {
							// Set settings of the current element
							state[ containerId ].settings = { ...state[ containerId ].settings, ...settings };
						}
					},
				},
			},
			folding: {
				initialState: {},
				reducers: {
					toggle: ( state, { payload } ) => {
						// Prepare
						const { containerIds = [ payload.containerId ], state: foldingState, all = false } = payload;

						// Act
						for ( const containerId of all ? Object.keys( state ) : containerIds ) {
							state[ containerId ] = undefined === foldingState ?
								! state[ containerId ] :
								foldingState;
						}
					},
				},
			},
			selection: {
				initialState: {},
				reducers: {
					toggle: ( state, { payload } ) => {
						// Prepare
						const { containerIds = [ payload.containerId ], state: selectionState, all = false } = payload;

						// Act
						for ( const containerId of all ? Object.keys( state ) : containerIds ) {
							const newState = undefined === selectionState ?
								! state[ containerId ] :
								selectionState;

							if ( newState ) {
								state[ containerId ] = newState;
							} else {
								delete state[ containerId ];
							}
						}
					},
				},
			},
		};
	}

	defaultUtils() {
		return {
			isValidChild: ( childModel, parentModel ) => {
				const parentElType = parentModel.get( 'elType' ),
					draggedElType = childModel.get( 'elType' ),
					parentIsInner = parentModel.get( 'isInner' ),
					draggedIsInner = childModel.get( 'isInner' );

				// Block's inner-section at inner-section column.
				if ( draggedIsInner && 'section' === draggedElType && parentIsInner && 'column' === parentElType ) {
					return false;
				}

				if ( draggedElType === parentElType ) {
					return false;
				}

				if ( 'section' === draggedElType && ! draggedIsInner && 'column' === parentElType ) {
					return false;
				}

				const childTypes = elementor.helpers.getElementChildType( parentElType );

				return childTypes && -1 !== childTypes.indexOf( childModel.get( 'elType' ) );
			},
			isValidGrandChild: ( childModel, targetContainer ) => {
				let result;

				const childElType = childModel.get( 'elType' );

				switch ( targetContainer.model.get( 'elType' ) ) {
					case 'document':
						result = true;
						break;

					case 'section':
						result = 'widget' === childElType;
						break;

					default:
						result = false;
				}

				return result;
			},
			isSameElement: ( sourceModel, targetContainer ) => {
				const targetElType = targetContainer.model.get( 'elType' ),
					sourceElType = sourceModel.get( 'elType' );

				if ( targetElType !== sourceElType ) {
					return false;
				}

				if ( 'column' === targetElType && 'column' === sourceElType ) {
					return true;
				}

				return targetContainer.model.get( 'isInner' ) === sourceModel.get( 'isInner' );
			},
			getPasteOptions: ( sourceModel, targetContainer ) => {
				const result = {};

				result.isValidChild = this.utils.isValidChild( sourceModel, targetContainer.model );
				result.isSameElement = this.utils.isSameElement( sourceModel, targetContainer );
				result.isValidGrandChild = this.utils.isValidGrandChild( sourceModel, targetContainer );

				return result;
			},
			isPasteEnabled: ( targetContainer ) => {
				const storage = elementorCommon.storage.get( 'clipboard' );

				// No storage? no paste.
				if ( ! storage || ! storage[ 0 ] ) {
					return false;
				}

				if ( ! ( storage[ 0 ] instanceof Backbone.Model ) ) {
					storage[ 0 ] = new Backbone.Model( storage[ 0 ] );
				}

				const pasteOptions = this.utils.getPasteOptions( storage[ 0 ], targetContainer );

				return Object.values( pasteOptions ).some(
					( opt ) => !! opt
				);
			},
		};
	}
}
