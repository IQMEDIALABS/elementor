import FinderLayout from './modal-layout';

export default class extends elementorModules.Module {
	onInit() {
		this.channel = Backbone.Radio.channel( 'ELEMENTOR:finder' );

		this.layout = new FinderLayout();

		elementor.route.register( 'finder', () => this.layout.showModal(), 'ctrl+e' );
	}
}
