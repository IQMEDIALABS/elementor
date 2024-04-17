import AiPromotionInfotip from './ai-promotion-infotip';
import AiPromotionInfotipContent from './ai-promotion-infotip-content';
import { DirectionProvider, ThemeProvider } from '@elementor/ui';

import useIntroduction from '../hooks/use-introduction';
import { FocusOutListener, useFocusOutListener } from '../helpers/focus-out-listener';

const AiPromotionInfotipWrapper = ( { anchor, header, contentText, controlType, unmountAction, colorScheme, isRTL, clickAction, placement, offset } ) => {
	const focusOutListener = useFocusOutListener();
	const { isViewed, markAsViewed } = useIntroduction( `ai_promotion_introduction_${ controlType }` );
	if ( isViewed ) {
		return;
	}

	return (
		<DirectionProvider rtl={ isRTL }>
			<ThemeProvider colorScheme={ colorScheme }>
				<FocusOutListener
					listener={ focusOutListener }
					onFocusOut={ () => unmountAction() }
				>
					<AiPromotionInfotip anchor={ anchor }
						focusOutListener={ focusOutListener }
						placement={ placement }
						offset={ offset }
						content={ ( <AiPromotionInfotipContent
							focusOutListener={ focusOutListener }
							header={ header }
							contentText={ contentText }
							onClose={ () => {
								markAsViewed();
								focusOutListener.remove();
								unmountAction();
							} }
							onClick={ () => {
								markAsViewed();
								focusOutListener.remove();
								unmountAction();
								if ( clickAction ) {
									clickAction();
								} else {
									anchor.click();
								}
							} }
						/> ) }
					/>
				</FocusOutListener>
			</ThemeProvider>
		</DirectionProvider>
	);
};

AiPromotionInfotipWrapper.propTypes = {
	anchor: PropTypes.object,
	header: PropTypes.string,
	contentText: PropTypes.string,
	controlType: PropTypes.string,
	unmountAction: PropTypes.func,
	colorScheme: PropTypes.string,
	isRTL: PropTypes.bool,
	clickAction: PropTypes.func,
	placement: PropTypes.string,
	offset: PropTypes.object,
};

export default AiPromotionInfotipWrapper;
