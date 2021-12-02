exports.Notifications = class Notifications {
	constructor( page ) {
		this.page = page;
	}

	async waitForToast( text ) {
		await this.page.waitForSelector( `#elementor-toast >> :text("${ text }")`, { timeout: 4000 } );
	}
};
