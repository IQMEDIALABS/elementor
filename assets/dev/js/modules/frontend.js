import elementorModules from './common';
import Document from '../frontend/document';

elementorModules.frontend = {
	Document: Document,
	tools: {
		StretchElement: require( 'elementor-frontend/tools/stretch-element' ),
	},
};

export default elementorModules;
