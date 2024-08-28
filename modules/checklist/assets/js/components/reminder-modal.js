import { Button, Card, CardActions, CardContent, Typography } from '@elementor/ui';
import PropTypes from 'prop-types';

const ReminderModal = ( { setOpen } ) => {

	const closeChecklist = ( e ) => {
		e.stopPropagation();
		setOpen( false );
	};

	return (
		<Card elevation={ 0 } sx={ { maxWidth: 336 } }>
			<CardContent>
				<Typography variant="subtitle2" sx={ { mb: 2 } }>Looking for your Launchpad Checklist?</Typography>
				<Typography variant="body2">Click the launch icon to continue setting up your site.</Typography>
			</CardContent>
			<CardActions>
				<Button size="small" variant="contained" onClick={ ( e ) => { closeChecklist( e ); } }>Got it</Button>
			</CardActions>
		</Card>
	);
};

export default ReminderModal;

ReminderModal.propTypes = {
	setOpen: PropTypes.func.isRequired,
};
