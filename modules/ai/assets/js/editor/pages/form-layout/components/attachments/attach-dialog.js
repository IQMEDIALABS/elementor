import { UrlDialog } from './url-dialog';
import PropTypes from 'prop-types';

const ATTACHMENT_TYPE_URL = 'url';

export const AttachDialog = ( props ) => {
	const type = props.type;

	switch ( type ) {
		case ATTACHMENT_TYPE_URL:
			return <UrlDialog
				onAttach={ props.onAttach }
				onClose={ props.onClose }
			/>;
	}

	return null;
};

AttachDialog.propTypes = {
	type: PropTypes.string,
	onAttach: PropTypes.func,
	onClose: PropTypes.func,
};

export default AttachDialog;
