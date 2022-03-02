import { useEffect, useContext, useState } from 'react';
import { useNavigate } from '@reach/router';

import Layout from '../../../templates/layout';
import FileProcess from '../../../shared/file-process/file-process';
import UnfilteredFilesDialog from 'elementor-app/organisms/unfiltered-files-dialog';

import { Context } from '../../../context/context-provider';

import useQueryParams from 'elementor-app/hooks/use-query-params';
import useKit from '../../../hooks/use-kit';

export default function ImportProcess() {
	const { kitState, kitActions, KIT_STATUS_MAP } = useKit(),
		[ errorType, setErrorType ] = useState( '' ),
		context = useContext( Context ),
		navigate = useNavigate(),
		{ referrer, file_url: fileURL, action_type: actionType, nonce } = useQueryParams().getAll(),
		isApplyAllForced = 'apply-all' === actionType,
		isUnfilteredFilesEnabled = elementorAppConfig[ 'import-export' ].isUnfilteredFilesEnabled,
		[ showUnfilteredFilesDialog, setShowUnfilteredFilesDialog ] = useState( false ),
		[ startImport, setStartImport ] = useState( false ),
		isKitHasSvgAssets = () => context.data.includes.some( ( item ) => [ 'templates', 'content' ].includes( item ) ),
		uploadKit = () => {
			const decodedFileURL = decodeURIComponent( fileURL );

			if ( referrer ) {
				context.dispatch( { type: 'SET_REFERRER', payload: referrer } );
			}

			context.dispatch( { type: 'SET_FILE', payload: decodedFileURL } );

			kitActions.upload( { file: decodedFileURL, kitLibraryNonce: nonce } );
		},
		importKit = () => {
			if ( isUnfilteredFilesEnabled || ! isKitHasSvgAssets() ) {
				setStartImport( true );
			} else {
				setShowUnfilteredFilesDialog( true );
			}
		},
		onCancelProcess = () => {
			context.dispatch( { type: 'SET_FILE', payload: null } );

			if ( 'kit-library' === referrer ) {
				navigate( '/kit-library' );
			} else {
				navigate( '/import' );
			}
		};

	// on load.
	useEffect( () => {
		if ( fileURL && ! context.data.file ) {
			// When the starting point of the app is the import/process screen and importing via file_url.
			uploadKit();
		} else if ( context.data.uploadedData ) {
			// When the import/process is the second step of the kit import process, after selecting the kit content.
			importKit();
		}
	}, [] );

	// Starting the import process.
	useEffect( () => {
		if ( startImport ) {
			kitActions.import( {
				session: context.data.uploadedData.session,
				include: context.data.includes,
				overrideConditions: context.data.overrideConditions,
				referrer: context.data.referrer,
			} );
		}
	}, [ startImport ] );

	// Updating the kit data after upload/import.
	useEffect( () => {
		if ( KIT_STATUS_MAP.INITIAL !== kitState.status ) {
			switch ( kitState.status ) {
				case KIT_STATUS_MAP.IMPORTED:
					context.dispatch( { type: 'SET_IMPORTED_DATA', payload: kitState.data } );
					break;
				case KIT_STATUS_MAP.UPLOADED:
					context.dispatch( { type: 'SET_UPLOADED_DATA', payload: kitState.data } );
					break;
				case KIT_STATUS_MAP.ERROR:
					setErrorType( kitState.data );
					break;
			}
		}
	}, [ kitState.status ] );

	// Actions after the kit upload/import data was updated.
	useEffect( () => {
		if ( KIT_STATUS_MAP.INITIAL !== kitState.status ) {
			if ( context.data.importedData ) { // After kit upload.
				navigate( '/import/complete' );
			} else if ( isApplyAllForced ) { // Forcing apply-all kit content.
				if ( context.data.uploadedData.conflicts ) {
					navigate( '/import/resolver' );
				} else {
					// The kitState must be reset due to staying in the same page, so that the useEffect will be re-triggered.
					kitActions.reset();

					importKit();
				}
			} else {
				navigate( '/import/content' );
			}
		}
	}, [ context.data.uploadedData, context.data.importedData ] );

	return (
		<Layout type="import">
			<section>
				<FileProcess
					errorType={ errorType }
					onDialogApprove={ onCancelProcess }
					onDialogDismiss={ onCancelProcess }
				/>

				<UnfilteredFilesDialog
					show={ showUnfilteredFilesDialog }
					setShow={ setShowUnfilteredFilesDialog }
					onReady={ () => {
						setShowUnfilteredFilesDialog( false );
						setStartImport( true );
					} }
					onCancel={ () => {
						setShowUnfilteredFilesDialog( false );
						onCancelProcess();
					} }
				/>
			</section>
		</Layout>
	);
}
