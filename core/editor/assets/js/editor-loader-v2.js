window.__elementorEditorV1LoadingPromise = new Promise( ( resolve ) => {
	window.addEventListener( 'elementor/init', () => {
		resolve();
	}, { once: true } );
} );

window.elementor.start();

const { init } = window.__UNSTABLE__elementorPackages.editor;

init( document.getElementById( 'elementor-editor-wrapper-v2' ) );
