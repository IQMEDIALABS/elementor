import elementorModules from '../modules/modules';
import Document from './document';
import StretchElement from './tools/stretch-element';
import StretchedElement from './handlers/stretched-element';
import BaseHandler from './handlers/base';
import SwiperBase from './handlers/base-swiper';
import CarouselBase from './handlers/base-carousel';
import NestedTabs from 'elementor/modules/nested-tabs/assets/js/frontend/handlers/nested-tabs';
import NestedAccordion from 'elementor/modules/nested-accordion/assets/js/frontend/handlers/nested-accordion';
import NestedTitleKeyboardHandler from './handlers/accessibility/nested-title-keyboard-handler';
import PlayingCards from './handlers/playing-cards';

elementorModules.frontend = {
	Document,
	tools: {
		StretchElement,
	},
	handlers: {
		Base: BaseHandler,
		StretchedElement,
		SwiperBase,
		CarouselBase,
		PlayingCards,
		NestedTabs,
		NestedAccordion,
		NestedTitleKeyboardHandler,
	},
};
