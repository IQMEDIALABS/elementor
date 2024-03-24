import {
	ThemeProvider,
	DirectionProvider,
	DialogHeaderGroup,
} from '@elementor/ui';
import PropTypes from 'prop-types';
import PageContent from './page-content';
import { onConnect } from './helpers';
import { RequestIdsProvider } from './context/requests-ids';

DialogHeaderGroup.propTypes = {
	gutterLeftAuto: PropTypes.bool,
	children: PropTypes.node,
};
const App = ( props ) => {
	return (
		<DirectionProvider rtl={ props.isRTL }>
			<ThemeProvider colorScheme={ props.colorScheme }>
				<RequestIdsProvider>
					<PageContent
						type={ props.type }
						controlType={ props.controlType }
						onClose={ props.onClose }
						onConnect={ onConnect }
						getControlValue={ props.getControlValue }
						setControlValue={ props.setControlValue }
						controlView={ props.controlView }
						additionalOptions={ props.additionalOptions }
					/>
				</RequestIdsProvider>
			</ThemeProvider>
		</DirectionProvider>
	);
};

App.propTypes = {
	colorScheme: PropTypes.oneOf( [ 'auto', 'light', 'dark' ] ),
	type: PropTypes.string,
	controlType: PropTypes.string,
	onClose: PropTypes.func,
	getControlValue: PropTypes.func,
	setControlValue: PropTypes.func,
	additionalOptions: PropTypes.object,
	controlView: PropTypes.object,
	isRTL: PropTypes.bool,
};

export default App;
