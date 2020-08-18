import ElementsHelper from 'elementor-tests-qunit/assets/dev/js/editor/document/elements/helper';

export const Expand = () => {
	QUnit.module( 'Expand', () => {
		QUnit.test( 'Simple', async ( assert ) => {
			const eWidget = ElementsHelper.createAutoButton(),
				eColumn = eWidget.parent,
				eSection = eColumn.parent,
				all = [ eSection, eColumn, eWidget ];

			assert.expect( all.length );

			// TODO: Timeout & promising because of 'container.navView'.
			setTimeout( () => {
				// Collapse all
				$e.run( 'navigator/elements/toggle-folding-all', { state: false } );
			} );

			const promises = all.map( ( container ) => new Promise( ( resolve ) => {
				setTimeout( () => {
					$e.run( 'navigator/elements/expand', { container } );

					assert.equal( container.navView.$el.children().hasClass( 'elementor-active' ), true );

					resolve();
				} );
			} ) );

			await Promise.all( promises );
		} );
	} );
};

export default Expand;
