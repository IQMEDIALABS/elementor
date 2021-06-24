import CommandBase from 'elementor-api/modules/command-base';

export class ChangeDeviceMode extends CommandBase {
	apply( args = {} ) {
		const devices = [ 'widescreen', 'desktop', 'laptop', 'tablet_extra', 'tablet', 'mobile_extra', 'mobile' ];
		let { device } = args;

		if ( ! device ) {
			const currentDeviceMode = elementor.channels.deviceMode.request( 'currentMode' );
			let modeIndex = devices.indexOf( currentDeviceMode );

			modeIndex++;

			if ( modeIndex >= devices.length ) {
				modeIndex = 0;
			}

			device = devices[ modeIndex ];
		}

		elementor.changeDeviceMode( device );
	}
}

export default ChangeDeviceMode;
