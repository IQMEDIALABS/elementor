import { ThemeProvider, DirectionProvider } from '@elementor/ui';
import PropTypes from 'prop-types';
import LayoutContent from './layout-content';
import { AttachmentPropType, AttachmentsTypesPropType } from './types/attachment';
import { ConfigProvider, LAYOUT_APP_MODES } from './pages/form-layout/context/config';

const LayoutApp = ( {
	mode,
	isRTL,
	colorScheme,
	attachmentsTypes,
	attachments,
	onClose,
	onConnect,
	onData,
	onInsert,
	onSelect,
	onGenerate,
} ) => {
	return (
		<DirectionProvider rtl={ isRTL }>
			<ThemeProvider colorScheme={ colorScheme }>
				<ConfigProvider
					mode={ mode }
					attachmentsTypes={ attachmentsTypes }
					onClose={ onClose }
					onConnect={ onConnect }
					onData={ onData }
					onInsert={ onInsert }
					onSelect={ onSelect }
					onGenerate={ onGenerate }
				>
					<LayoutContent
						attachments={ attachments }
					/>
				</ConfigProvider>
			</ThemeProvider>
		</DirectionProvider>
	);
};

LayoutApp.propTypes = {
	mode: PropTypes.oneOf( LAYOUT_APP_MODES ).isRequired,
	colorScheme: PropTypes.oneOf( [ 'auto', 'light', 'dark' ] ),
	isRTL: PropTypes.bool,
	attachmentsTypes: AttachmentsTypesPropType,
	attachments: PropTypes.arrayOf( AttachmentPropType ),
	onClose: PropTypes.func.isRequired,
	onConnect: PropTypes.func.isRequired,
	onData: PropTypes.func.isRequired,
	onInsert: PropTypes.func.isRequired,
	onSelect: PropTypes.func.isRequired,
	onGenerate: PropTypes.func.isRequired,
};

export default LayoutApp;
