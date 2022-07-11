import { useContext } from 'react';
import { useNavigate } from '@reach/router';
import ActionsFooter from '../../../../../shared/actions-footer/actions-footer';
import Button from 'elementor-app/ui/molecules/button';
import { SharedContext } from 'elementor/core/app/modules/import-export/assets/js/context/shared-context/shared-context-provider';

export default function ImportContentFooter( { hasPlugins, hasConflicts, isImportAllowed, onResetProcess } ) {
	const sharedContext = useContext( SharedContext ),
	{ referrer } = sharedContext.data,
	navigate = useNavigate(),
		getNextPageUrl = () => {
			if ( hasConflicts ) {
				return 'import/resolver';
			} else if ( hasPlugins ) {
				return 'import/plugins-activation';
			}

			return 'import/process';
		};

		const eventTrack = ( action ) => {
			$e.run( action );
		};

	return (
		<ActionsFooter>
			<Button
				text={ __( 'Previous', 'elementor' ) }
				variant="contained"
				onClick={ () => {
					if ( hasPlugins ) {
						navigate( 'import/plugins/' );
					} else {
						onResetProcess();
					}
					if ( 'kit-library' === referrer ) {
						eventTrack( 'kit-library/go-back' );
					}
				} }
			/>

			<Button
				variant="contained"
				text={ __( 'Import', 'elementor' ) }
				color={ isImportAllowed ? 'primary' : 'disabled' }
				onClick={ () => {
					if ( 'kit-library' === referrer ) {
						eventTrack( 'kit-library/approve-import' );
					}
					return isImportAllowed && navigate( getNextPageUrl() );
				} }
			/>
		</ActionsFooter>
	);
}

ImportContentFooter.propTypes = {
	hasPlugins: PropTypes.bool,
	hasConflicts: PropTypes.bool,
	isImportAllowed: PropTypes.bool,
	onResetProcess: PropTypes.func.isRequired,
};
