import PropTypes from 'prop-types';
import ChecklistCardContent from './checklist-card-content';
import { ListItemButton, ListItemIcon, ListItemText, Collapse, Checkbox } from '@elementor/ui';
import { CircleCheckFilledIcon, ChevronDownIcon, RadioButtonUncheckedIcon, UpgradeIcon } from '@elementor/icons';

function CheckListItem( props ) {
	const { expandedIndex, setExpandedIndex, setSteps, index, step } = props,
		chevronStyle = index === expandedIndex ? { transform: 'rotate(180deg)' } : {},
		isChecked = step.is_absolute_completed || step.is_marked_completed || step.is_immutable_completed;

	const handleExpandClick = () => {
		setExpandedIndex( index === expandedIndex ? -1 : index );
	};

	return (
		<>
			<ListItemButton onClick={ handleExpandClick } className={ `e-checklist-item-button checklist-step-${ step.config.id }` }>
				<ListItemIcon>
					<Checkbox
						className={ `step-check-icon ${ isChecked ? 'checked' : 'unchecked' }` }
						icon={ <RadioButtonUncheckedIcon /> }
						checkedIcon={ <CircleCheckFilledIcon color="primary" /> }
						edge="start"
						checked={ isChecked }
						tabIndex={ -1 }
						inputProps={ { 'aria-labelledby': step.config.title } }
					/>
				</ListItemIcon>
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
