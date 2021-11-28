import PropTypes from 'prop-types';
import Icon from 'elementor-app/ui/atoms/icon';

export default function ItemIndicator( { indicator: { title, icon, section }, toggleSelection } ) {
	const handleClick = () => {
		setTimeout( () => toggleSelection( { section } ) );
	};

	return (
		<div className="elementor-navigator__element__indicator" title={ title } onClick={ handleClick }>
			<Icon className={ `eicon-${ icon }` } />
		</div>
	);
}

ItemIndicator.propTypes = {
	indicator: PropTypes.shape( {
		title: PropTypes.string,
		icon: PropTypes.string,
		section: PropTypes.string,
	} ),
	toggleSelection: PropTypes.func,
};
