import Accordion from './handlers/accordion';
import Alert from './handlers/alert';
import Counter from './handlers/counter';
import Progress from './handlers/progress';
import Tabs from './handlers/tabs';
import Toggle from './handlers/toggle';
import Video from './handlers/video';
import ImageCarousel from './handlers/image-carousel';
import TextEditor from './handlers/text-editor';
import sectionHandlers from './handlers/section/section';
import columnHandlers from './handlers/column';
import globalHandler from './handlers/global';

module.exports = function( $ ) {
	const self = this;

	// element-type.skin-type
	const handlers = {
		// Elements
		section: sectionHandlers,
		column: columnHandlers,

		// Widgets
		'accordion.default': Accordion,
		'alert.default': Alert,
		'counter.default': Counter,
		'progress.default': Progress,
		'tabs.default': Tabs,
		'toggle.default': Toggle,
		'video.default': Video,
		'image-carousel.default': ImageCarousel,
		'text-editor.default': TextEditor,
	};

	const handlersInstances = {};

	const addGlobalHandlers = function() {
		elementorFrontend.hooks.addAction( 'frontend/element_ready/global', globalHandler );
	};

	const addElementsHandlers = () => {
		$.each( handlers, ( elementName, Handlers ) => {
			const elementData = elementName.split( '.' );

			elementName = elementData[ 0 ];

			const skin = elementData[ 1 ] || null;

			this.attachHandler( elementName, Handlers, skin );
		} );
	};

	const addHandlerWithHook = ( elementName, Handler, skin = 'default' ) => {
		skin = skin ? '.' + skin : '';

		elementorFrontend.hooks.addAction( `frontend/element_ready/${ elementName }${ skin }`, ( $element ) => {
			this.addHandler( Handler, { $element: $element }, true );
		} );
	};

	this.init = function() {
		self.initHandlers();
	};

	this.initHandlers = function() {
		addGlobalHandlers();

		addElementsHandlers();
	};

	this.addHandler = function( HandlerClass, options ) {
		const elementID = options.$element.data( 'model-cid' );

		let handlerID;

		// If element is in edit mode
		if ( elementID ) {
			handlerID = HandlerClass.prototype.getConstructorID();

			if ( ! handlersInstances[ elementID ] ) {
				handlersInstances[ elementID ] = {};
			}

			const oldHandler = handlersInstances[ elementID ][ handlerID ];

			if ( oldHandler ) {
				oldHandler.onDestroy();
			}
		}

		const newHandler = new HandlerClass( options );

		if ( elementID ) {
			handlersInstances[ elementID ][ handlerID ] = newHandler;
		}
	};

	this.attachHandler = ( elementName, Handlers, skin ) => {
		if ( ! Array.isArray( Handlers ) ) {
			Handlers = [ Handlers ];
		}

		Handlers.forEach( ( Handler ) => addHandlerWithHook( elementName, Handler, skin ) );
	};

	this.getHandlers = function( handlerName ) {
		if ( handlerName ) {
			return handlers[ handlerName ];
		}

		return handlers;
	};

	this.runReadyTrigger = function( scope ) {
		if ( elementorFrontend.config.is_static ) {
			return;
		}

		// Initializing the `$scope` as frontend jQuery instance
		const $scope = jQuery( scope ),
			elementType = $scope.attr( 'data-element_type' );

		if ( ! elementType ) {
			return;
		}

		elementorFrontend.hooks.doAction( 'frontend/element_ready/global', $scope, $ );

		elementorFrontend.hooks.doAction( 'frontend/element_ready/' + elementType, $scope, $ );

		if ( 'widget' === elementType ) {
			elementorFrontend.hooks.doAction( 'frontend/element_ready/' + $scope.attr( 'data-widget_type' ), $scope, $ );
		}
	};
};
