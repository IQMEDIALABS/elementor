
import { Alert, Button, IconButton, Stack } from '@elementor/ui';
import { XIcon } from '@elementor/icons';

const UpgradeBanner = ( { onClose, ...props } ) => {
	return (
		<Alert
			icon={ false }
			action={
				<Stack direction="row" alignItems="center" gap={ 1 }>
					<Button
						size="small"
						color="inherit"
						variant="outlined"
						onClick={ () => window.open( 'https://go.elementor.com/ai-banner-free-upgrade/', '_blank' ) }
					>
						{ __( 'Upgrade', 'elementor' ) }
					</Button>

					<IconButton color="inherit" size="small" onClick={ onClose }>
						<XIcon />
					</IconButton>
				</Stack>
			}
			{ ...props }
			sx={ {
				backgroundColor: 'accent.main',
				color: 'accent.contrastText',
				...props.sx,
			} }
		>
			{ __( 'You’re using a limited license. Get maximum access to Elementor AI.', 'elementor' ) }
		</Alert>
	);
};

UpgradeBanner.propTypes = {
	onClose: PropTypes.func,
	sx: PropTypes.object,
};

export default UpgradeBanner;
