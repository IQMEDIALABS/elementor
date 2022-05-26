import Base from '../types/base/element-base';
import Model from 'elementor-elements/models/widget';
import { default as View } from 'elementor-elements/views/widget';

/**
 * @name elementor.elements.types.Widget
 */
export default class Widget extends Base {
	getType() {
		return 'widget';
	}

	getView() {
		return View;
	}

	getModel() {
		return Model;
	}
}
