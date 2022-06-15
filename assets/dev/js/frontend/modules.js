import elementorModules from '../modules/modules';
import Document from './document';
import StretchElement from './tools/stretch-element';
import BaseHandler from './handlers/base';
import SwiperBase from './handlers/base-swiper';
import BaseTabsV2 from 'elementor-frontend/handlers/base-tabs-v2';

elementorModules.frontend = {
	Document: Document,
	tools: {
		StretchElement: StretchElement,
	},
	handlers: {
		Base: BaseHandler,
		SwiperBase: SwiperBase,
		BaseTabsV2,
	},
};
