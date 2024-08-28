var ControlBaseDataView = require( 'elementor-controls/base-data' ),
	ControlSelectItemView;

ControlSelectItemView = ControlBaseDataView.extend( {
	updatePlaceholder() {
		const select = this.ui.select;

		if ( ! select ) {
			return;
		}

		let selected = select.find( 'option:selected' );

		// When option with an empty value ('') selected, and it's not the placeholder option,
		// set the selected option to the placeholder.
		if ( '' === selected.val() && ! selected.hasClass( 'e-option-placeholder' ) ) {
			selected = select.find( '.e-option-placeholder' );

			selected.prop( 'selected', true );
		}

		if ( selected.hasClass( 'e-option-placeholder' ) ) {
			select.addClass( 'e-select-placeholder' );
		} else {
			select.removeClass( 'e-select-placeholder' );
		}
	},

	onReady() {
		const placeholder = this.getControlPlaceholder();

		if ( placeholder ) {
			jQuery( '<option>' ).val( '' )
				.text( this.model.get( 'options' )[ placeholder ] )
				.addClass( 'e-option-placeholder' )
				.prependTo( this.ui.select );
		}

		this.updatePlaceholder();

		this.maybeUpdateStickyParentValue();
	},

	onInputChange() {
		this.updatePlaceholder();
	},

	onPasteStyle( control, clipboardValue ) {
		if ( control.groups ) {
			return control.groups.some( function( group ) {
				return ControlSelectItemView.onPasteStyle( group, clipboardValue );
			} );
		}

		return undefined !== control.options[ clipboardValue ];
	},


	maybeUpdateStickyParentValue() {
		const modelName = this.model.get( 'name' );

		if ( 'sticky_parent' !== modelName ) {
			return;
		}

		const value = this.container.settings.get( modelName );
		const oldValues = [ '', 'yes' ];

		if ( ! oldValues.includes( value ) ) {
			return;
		}

		const updatedValue = '' === value
			? 'js-fixed'
			: 'js-stay-in-column';

		this.setSettingsModel( updatedValue );
		this.applySavedValue();
	},
} );

module.exports = ControlSelectItemView;
