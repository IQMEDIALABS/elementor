export default class FloatingBarDomHelper {
	constructor( $element ) {
		this.$element = $element;
	}

	maybeMoveToTop() {
		const el = this.$element[ 0 ];
		const widget = el.querySelector( '.e-floating-bars' );

		if ( elementorFrontend.isEditMode() ) {
			widget.classList.add( 'is-sticky' );
			return;
		}

		if (
			el.dataset.widget_type.startsWith( 'floating-bars' ) &&
			widget.classList.contains( 'has-vertical-position-top' ) &&
			! widget.classList.contains( 'is-sticky' )
		) {
			const wpAdminBar = document.getElementById( 'wpadminbar' );

			if ( wpAdminBar ) {
				wpAdminBar.after( widget );
			} else {
				document.body.prepend( widget );
			}
		}
	}
}
