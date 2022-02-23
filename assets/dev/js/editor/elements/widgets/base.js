import ElementBase from '../types/base';

export default class WidgetBase extends ElementBase {
	/**
	 * @return {string}
	 */
	getWidgetType() {
		elementorModules.ForceMethodImplementation();
	}

	getTypeKey() {
		return this.getType() + '-' + this.getWidgetType();
	}
}
