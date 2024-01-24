import { Dialog, DialogContent } from '@elementor/ui';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { __ } from '@wordpress/i18n';
import { useAttachUrlService } from '../../hooks/use-attach-url-service';
import { AlertDialog } from '../../../../components/alert-dialog';
import { useTimeout } from '../../../../hooks/use-timeout';
import useUserInfo from '../../../../hooks/use-user-info';

export const UrlDialog = ( props ) => {
	const iframeRef = useRef( null );
	const { iframeSource } = useAttachUrlService( { targetUrl: props.url } );
	const iframeOrigin = new URL( iframeSource ).origin;
	const [ isTimeout, turnOffTimeout ] = useTimeout( 10_000 );
	const {
		isConnected,
		hasSubscription,
		credits,
		usagePercentage,
	} = useUserInfo();

	useEffect( () => {
		const onMessage = ( event ) => {
			if ( event.origin !== iframeOrigin ) {
				return;
			}

			const { type, html, url } = event.data;

			switch ( type ) {
				case 'element-selector/close':
					props.onClose();
					break;
				case 'element-selector/loaded':
					turnOffTimeout();
					break;
				case 'element-selector/attach':
					props.onAttach( [ {
						type: 'url',
						previewHTML: html,
						content: html,
						label: url ? new URL( url ).host : '',
					} ] );
					break;
			}
		};

		window.addEventListener( 'message', onMessage );

		return () => {
			window.removeEventListener( 'message', onMessage );
		};
	}, [ iframeOrigin, iframeSource, props, turnOffTimeout ] );

	if ( ! iframeSource ) {
		return (
			<AlertDialog
				message={ __( 'The app is not available. Please try again later.', 'elementor' ) }
				onClose={ props.onClose }
			/>
		);
	}
	return (
		<Dialog
			open={ true }
			fullScreen={ true }
			hideBackdrop={ true }
			maxWidth="md"
			sx={ {
				'& .MuiPaper-root': {
					backgroundColor: 'transparent',
				},
			} }
		>
			<DialogContent
				sx={ {
					padding: 0,
				} }
			>
				{
					isTimeout && <AlertDialog
						message={ __( 'The app is not responding. Please try again later.', 'elementor' ) }
						onClose={ props.onClose }
					/>
				}

				{
					! isTimeout && (
						<iframe
							ref={ iframeRef }
							title={ __( 'URL as a reference', 'elementor' ) }
							src={ iframeSource }
							onLoad={ () => {
								const { access_level: accessLevel, access_tier: accessTier, is_pro: isPro } = window.elementorAppConfig[ 'kit-library' ];

								iframeRef.current.contentWindow.postMessage( {
									type: 'referer/info',
									info: {
										page: {
											url: window.location.href,
										},
										products: {
											core: {
												version: window.elementor.config.version,
											},
											pro: {
												isPro,
												accessLevel,
												accessTier,
											},
											ai: {
												isConnected,
												hasSubscription,
												credits,
												usagePercentage,
											},
										},
										user: {
											isAdmin: window.elementor.config.user.is_administrator,
										},
									},
								}, iframeOrigin );
							} }
							style={ {
								border: 'none',
								overflow: 'scroll',
								width: '100%',
								height: '100%',
								backgroundColor: 'rgba(255,255,255,0.6)',
							} }
						/>
					) }
			</DialogContent>
		</Dialog>
	);
};

UrlDialog.propTypes = {
	onAttach: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	url: PropTypes.string,
};
