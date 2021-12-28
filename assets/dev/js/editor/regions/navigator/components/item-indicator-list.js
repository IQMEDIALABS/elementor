import ItemIndicator from './item-indicator';
import PropTypes from 'prop-types';

export default function ItemIndicatorList( { settings, onActivateSection } ) {
	const list = Object.entries( elementor.navigator.region.indicators ).map(
		( [ key, indicator ] ) => {
			return indicator.settingKeys.some( ( settingKey ) => settings[ settingKey ] ) &&
				<ItemIndicator key={ key } indicator={ indicator } onActivateSection={ onActivateSection } />;
		}
	);

	return (
		<div className="elementor-navigator__element__indicators">
			{ list }
		</div>
	);
}

ItemIndicatorList.propTypes = {
	settings: PropTypes.object,
	onActivateSection: PropTypes.func,
};
