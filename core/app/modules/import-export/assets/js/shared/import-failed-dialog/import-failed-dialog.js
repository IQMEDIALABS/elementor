import Dialog from 'elementor-app/ui/dialog/dialog';

import useAction from 'elementor-app/hooks/use-action';

export default function ImportFailedDialog( props ) {
	const action = useAction();

	return (
		<Dialog
			title={ __( 'Something went wrong', 'elementor' ) }
			text={ __( 'Nothing to worry about, just try again. Contact support if the problem continues.', 'elementor' ) }
			approveButtonColor="primary"
			approveButtonText={ __( 'Retry', 'elementor' ) }
			approveButtonOnClick={ props.onRetry }
			dismissButtonText={ __( 'Exit', 'elementor' ) }
			dismissButtonOnClick={ action.backToDashboard }
		/>
	);
}

ImportFailedDialog.propTypes = {
	onRetry: PropTypes.func.isRequired,
};
