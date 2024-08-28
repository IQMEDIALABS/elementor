import PropTypes from 'prop-types';
import ChecklistCardContent from './checklist-card-content';
import { ListItemButton, ListItemIcon, ListItemText, Collapse } from '@elementor/ui';
import { CircleCheckFilledIcon, ChevronDownIcon, RadioButtonUncheckedIcon, UpgradeIcon } from '@elementor/icons';

function CheckListItem( props ) {
	const { expandedIndex, setExpandedIndex, setSteps, index, step } = props,
		chevronStyle = index === expandedIndex ? { transform: 'rotate(180deg)' } : {};

	const handleExpandClick = () => {
		setExpandedIndex( index === expandedIndex ? -1 : index );
	};

	return (
		<>
			<ListItemButton onClick={ handleExpandClick } className={ `e-checklist-item-button checklist-step-${ step.config.id }` }>
				<ListItemIcon>{ step.is_absolute_completed || step.is_marked_completed || step.is_immutable_completed
					? <CircleCheckFilledIcon color="primary" className="step-check-icon checked" />
					: <RadioButtonUncheckedIcon className="step-check-icon unchecked" />
				}</ListItemIcon>
				<ListItemText primary={ step.config.title } primaryTypographyProps={ { variant: 'body2' } } />
				{ step.config.is_locked ? <UpgradeIcon color="promotion" sx={ { mr: 1 } } /> : null }
				<ChevronDownIcon sx={ { ...chevronStyle, transition: '300ms' } } />
			</ListItemButton>
			<Collapse in={ index === expandedIndex } >
				<ChecklistCardContent step={ step } setSteps={ setSteps } />
			</Collapse>
		</>
	);
}

export default CheckListItem;

CheckListItem.propTypes = {
	step: PropTypes.object.isRequired,
	expandedIndex: PropTypes.number,
	setExpandedIndex: PropTypes.func.isRequired,
	setSteps: PropTypes.func.isRequired,
	index: PropTypes.number.isRequired,
};
