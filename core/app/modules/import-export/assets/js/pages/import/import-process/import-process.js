import { useEffect, useContext, useState, useMemo } from 'react';
import { useNavigate } from '@reach/router';

import { SharedContext } from '../../../context/shared-context/shared-context-provider';
import { ImportContext } from '../../../context/import-context/import-context-provider';

import Layout from '../../../templates/layout';
import FileProcess from '../../../shared/file-process/file-process';
import UnfilteredFilesDialog from 'elementor-app/organisms/unfiltered-files-dialog';

import useQueryParams from 'elementor-app/hooks/use-query-params';
import useKit from '../../../hooks/use-kit';
import useImportActions from '../hooks/use-import-actions';
// import UseImportKitLibraryPlugins from '../import-plugins/hooks/use-import-kit-library-plugins';
import ImportKitLibraryPlugins from '../import-plugins/components/import-kit-library-plugins/import-kit-library-plugins';

export default function ImportProcess() {
	const sharedContext = useContext( SharedContext ),
		importContext = useContext( ImportContext ),
		navigate = useNavigate(),
		[ errorType, setErrorType ] = useState( '' ),
		[ showUnfilteredFilesDialog, setShowUnfilteredFilesDialog ] = useState( false ),
		[ startImport, setStartImport ] = useState( false ),
		{ kitState, kitActions, KIT_STATUS_MAP } = useKit(),
		{ referrer, file_url: fileURL, action_type: actionType } = useQueryParams().getAll(),
		{ includes, selectedCustomPostTypes } = sharedContext.data || {},
		{ file, uploadedData, importedData, overrideConditions, plugins, importedPlugins } = importContext.data || {},
		isKitHasSvgAssets = useMemo( () => includes.some( ( item ) => [ 'templates', 'content' ].includes( item ) ), [ includes ] ),
		{ navigateToMainScreen } = useImportActions(),
		uploadKit = () => {
			const decodedFileURL = decodeURIComponent( fileURL );

			importContext.dispatch( { type: 'SET_FILE', payload: decodedFileURL } );

			kitActions.upload( { file: decodedFileURL } );
		},
		importKit = () => {
			if ( elementorAppConfig[ 'import-export' ].isUnfilteredFilesEnabled || ! isKitHasSvgAssets ) {
				setStartImport( true );
			} else {
				setShowUnfilteredFilesDialog( true );
			}
		},
		setCptFromKitLibrary = () => {
			if ( kitState.data.manifest[ 'custom-post-type-title' ] ) {
				const cptArray = Object.keys( kitState.data.manifest[ 'custom-post-type-title' ] );
				sharedContext.dispatch( { type: 'SET_SELECTED_CPT', payload: cptArray } );
				console.log( 'cptArray: ', cptArray );
			}
		},
		importPlugins = () => {
			if ( kitState.data.manifest.plugins && kitState.data.manifest.plugins.length > 0 ) {
				importContext.dispatch( { type: 'SET_PLUGINS', payload: kitState.data.manifest.plugins } );
				console.log( 'kitState.data.manifest.plugins: ', kitState.data.manifest.plugins );
			}
		},
		onCancelProcess = () => {
			importContext.dispatch( { type: 'SET_FILE', payload: null } );

			navigateToMainScreen();
		};

	// on load.
	useEffect( () => {
		// Saving the referrer value globally.
		if ( referrer ) {
			sharedContext.dispatch( { type: 'SET_REFERRER', payload: referrer } );
		}
		if ( fileURL && ! file ) {
			// When the starting point of the app is the import/process screen and importing via file_url.
			uploadKit();
		} else if ( uploadedData ) {
			// When the import/process is the second step of the kit import process, after selecting the kit content.
			importKit();
		} else {
			navigate( 'import' );
		}
	}, [] );

	// Starting the import process.
	useEffect( () => {
		if ( startImport ) {
			console.log( 'selectedCustomPostTypes', selectedCustomPostTypes );
			kitActions.import( {
				session: uploadedData.session,
				include: includes,
				overrideConditions: overrideConditions,
				referrer,
				selectedCustomPostTypes,
			} );
		}
	}, [ startImport ] );

	// Updating the kit data after upload/import.
	useEffect( () => {
		if ( KIT_STATUS_MAP.INITIAL !== kitState.status ) {
			switch ( kitState.status ) {
				case KIT_STATUS_MAP.IMPORTED:
					importContext.dispatch( { type: 'SET_IMPORTED_DATA', payload: kitState.data } );
					break;
				case KIT_STATUS_MAP.UPLOADED:
					importContext.dispatch( { type: 'SET_UPLOADED_DATA', payload: kitState.data } );
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
			if ( importedData ) { // After kit upload.
				navigate( '/import/complete' );
			} else if ( 'apply-all' === actionType ) { // Forcing apply-all kit content.
				if ( uploadedData.conflicts ) {
					navigate( '/import/resolver' );
				} else {
					// The kitState must be reset due to staying in the same page, so that the useEffect will be re-triggered.
					kitActions.reset();

					//check if cpt are included in this kit and ad them to sharedContext
					// setCptFromKitLibrary();

					//If plugins are included in this kit
					importPlugins();

					importKit();
				}
			} else {
				navigate( '/import/plugins' );
			}
		}
	}, [ uploadedData, importedData ] );

	return (
		<Layout type="import">
			<section>
				{/*{ plugins && 0 === importedPlugins.length &&*/}
				{/*	<ImportKitLibraryPlugins />*/}
				{/*}*/}

				<FileProcess
					info={ uploadedData && __( 'Importing your content, templates and site settings', 'elementor' ) }
					errorType={ errorType }
					onDialogApprove={ onCancelProcess }
					onDialogDismiss={ onCancelProcess }
				/>

				<UnfilteredFilesDialog
					show={ showUnfilteredFilesDialog }
					setShow={ setShowUnfilteredFilesDialog }
					confirmModalText={ __( 'This allows Elementor to scan your SVGs for malicious content. Otherwise, you can skip any SVGs in this import.', 'elementor' ) }
					errorModalText={ __( 'Nothing to worry about, just continue without importing SVGs or go back and start the import again.', 'elementor' ) }
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
