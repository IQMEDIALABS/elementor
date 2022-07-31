import { Grid } from '@elementor/app-ui';
import HeaderButtons from '../../../../../../assets/js/layout/header-buttons';
import { appsEventTrackingDispatch } from 'elementor-app/event-track/apps-event-tracking';

export default function Header( props ) {
	const eventTracking = ( command, eventName, source = null, kitName = null ) => appsEventTrackingDispatch(
			command,
			{
				kit_name: kitName,
				source,
				event: eventName,
			},
		),
		onClose = () => {
			eventTracking( 'kit-library/close', 'top bar close kit library', props?.pageId, props.kitName );
			window.top.location = elementorAppConfig.admin_url;
		};

	return (
		<Grid container alignItems="center" justify="space-between" className="eps-app__header">
			{ props.startColumn || <a
				className="eps-app__logo-title-wrapper"
				href="#/kit-library"
				onClick={ () => eventTracking( 'kit-library/logo', 'top panel logo', 'home page' ) }
			>
				<i className="eps-app__logo eicon-elementor" />
				<h1 className="eps-app__title">{ __( 'Kit Library', 'elementor' ) }</h1>
			</a> }
			{ props.centerColumn || <span /> }
			{ props.endColumn || <div style={ { flex: 1 } }>
				<HeaderButtons buttons={ props.buttons } onClose={ () => onClose() } />
			</div> }
		</Grid>
	);
}

Header.propTypes = {
	startColumn: PropTypes.node,
	endColumn: PropTypes.node,
	centerColumn: PropTypes.node,
	buttons: PropTypes.arrayOf( PropTypes.object ),
	kitName: PropTypes.string,
	pageId: PropTypes.string,
};
