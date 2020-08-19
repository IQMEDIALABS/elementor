import ElementsHelper from 'elementor-tests-qunit/assets/dev/js/editor/document/elements/helper';

export const Hide = () => {
	QUnit.module( 'Hide', () => {
		QUnit.test( 'Simple', ( assert ) => {
			const eButton = ElementsHelper.createAutoButton(),
				done = assert.async();

			// TODO: Timeout & promising because of 'container.navView'.
			setTimeout( () => {
				$e.run( 'navigator/elements/hide', {
					container: eButton,
				} );

				assert.equal( eButton.model.get( 'hidden' ), true );

				done();
			} );
		} );
	} );
};

export default Hide;
