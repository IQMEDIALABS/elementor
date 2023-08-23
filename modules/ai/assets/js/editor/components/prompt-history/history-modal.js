import { Backdrop, Box, LinearProgress, Modal, Slide, styled } from '@elementor/ui';
import usePromptHistory from '../../hooks/use-prompt-history';
import { HISTORY_TYPES } from './history-types';
import PromptHistoryModalHeader from './parts/modal-header';
import PromptHistoryPeriod from './parts/modal-period';
import { PromptHistoryContext } from './index';
import { useContext, useEffect, useRef } from 'react';
import useDeletePromptHistoryItem from '../../hooks/use-delete-prompt-history-item';
import PromptErrorMessage from '../prompt-error-message';
import { groupPromptHistoryData, LAST_30_DAYS_KEY, LAST_7_DAYS_KEY } from './helpers/history-period-helpers';
import PromptHistoryEmpty from './parts/modal-empty';

const StyledContent = styled( Box )( ( { theme } ) => ( {
	width: 360,
	position: 'relative',
	marginTop: theme.spacing( 5 ),
	marginRight: theme.spacing( 5 ),
	backgroundColor: theme.palette.background.paper,
	borderRadius: theme.border.radius.sm,
	height: '52vh',
} ) );

const PromptHistoryModal = ( { promptType, ...props } ) => {
	const lastRun = useRef( () => {} );

	const {
		items,
		isLoading: isHistoryFetchingInProgress,
		error: historyFetchingError,
		send: fetchData,
	} = usePromptHistory( { promptType } );

	const {
		isLoading: isDeletingInProgress,
		error: historyDeletingError,
		send: deleteItem,
	} = useDeletePromptHistoryItem( { promptType } );

	const { onModalClose } = useContext( PromptHistoryContext );

	const isError = historyFetchingError || historyDeletingError;
	const isLoading = isHistoryFetchingInProgress || isDeletingInProgress;

	useEffect( () => {
		lastRun.current = async () => fetchData();

		lastRun.current();
	}, [] );

	const onHistoryItemDelete = async ( id ) => {
		lastRun.current = async () => await deleteItem( id );

		await lastRun.current();

		if ( ! historyDeletingError ) {
			lastRun.current = async () => await fetchData();

			await lastRun.current();
		}
	};

	const renderPeriods = () => {
		const groupData = groupPromptHistoryData( items );
		const periods = [];

		if ( groupData[ LAST_7_DAYS_KEY ]?.items?.length ) {
			periods.push( <PromptHistoryPeriod periodTitle={ groupData[ LAST_7_DAYS_KEY ].label }
				onHistoryItemDelete={ onHistoryItemDelete }
				historyItems={ groupData[ LAST_7_DAYS_KEY ].items } /> );
		}

		if ( groupData[ LAST_30_DAYS_KEY ]?.items?.length ) {
			periods.push( <PromptHistoryPeriod periodTitle={ groupData[ LAST_30_DAYS_KEY ].label }
				onHistoryItemDelete={ onHistoryItemDelete }
				historyItems={ groupData[ LAST_30_DAYS_KEY ].items } /> );
		}

		for ( let i = 11; i >= 0; i-- ) {
			if ( groupData[ i ] ) {
				periods.push( <PromptHistoryPeriod periodTitle={ groupData[ i ].label }
					onHistoryItemDelete={ onHistoryItemDelete }
					historyItems={ groupData[ i ].items } /> );
			}
		}

		return periods;
	};

	return (
		<Modal
			container={ () => document.querySelector( '.MuiDialogContent-root:not(.MuiBackdrop-root)' ) }
			open={ true }
			hideBackdrop={ true }
			onClose={ onModalClose }
			sx={ { position: 'absolute' } }
			{ ...props }>
			<Backdrop open={ true }
				sx={ { position: 'absolute', justifyContent: 'flex-end', alignItems: 'flex-start' } }
				aria-hidden={ false }>
				<Slide direction="left" in={ true } mountOnEnter unmountOnExit>
					<StyledContent aria-label={ __( 'Prompt history modal', 'elementor' ) }>
						<PromptHistoryModalHeader onClose={ onModalClose } />

						{ isError && <PromptErrorMessage error={ isError } onRetry={ lastRun.current } sx={ { position: 'absolute', zIndex: 1 } } /> }

						{ isLoading && <LinearProgress color="secondary" /> }

						<Box sx={ { overflowY: 'scroll', height: '85%' } }>
							{ ! isLoading && 0 === items?.length && <PromptHistoryEmpty promptType={ promptType } /> }
							{ ! isLoading && items?.length > 0 && renderPeriods() }
						</Box>
					</StyledContent>
				</Slide>
			</Backdrop>
		</Modal>
	);
};

PromptHistoryModal.propTypes = {
	promptType: PropTypes.oneOf( Object.values( HISTORY_TYPES ) ).isRequired,
};

export default PromptHistoryModal;
