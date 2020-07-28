import BaseOpenClose from '../base/base-open-close';

export class KitSaveRouteHistory extends BaseOpenClose {
	getCommand() {
		return 'panel/global/open';
	}

	getId() {
		return 'save-route-history--/panel/global/open';
	}

	getConditions( args = {}, result ) {
		return args.route && args.container;
	}

	apply( args ) {
		this.component.routeHistory = args;
	}
}

export default KitSaveRouteHistory;
