import * as utils from './deprecation/utils';

export default class Deprecation {
	deprecated( name, version, replacement ) {
		return utils.deprecated( name, version, replacement );
	}

	isSoftDeprecated( version ) {
		return utils.isSoftDeprecated( version );
	}

	isHardDeprecated( version ) {
		return utils.isHardDeprecated( version );
	}
}

