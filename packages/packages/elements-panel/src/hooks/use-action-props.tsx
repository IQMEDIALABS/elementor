import * as React from 'react';
import { PlusIcon } from '../icons/plus-icon';
import { __ } from '@wordpress/i18n';
import { openRoute, useIsPreviewMode, useIsRouteActive } from '@elementor/v1-adapters';

export default function useActionProps() {
	const isElementsPanelActive = useIsRouteActive( 'panel/elements' );
	const isSiteSettingsActive = useIsRouteActive( 'panel/global' );
	const isPreviewMode = useIsPreviewMode();

	const selected = isElementsPanelActive && ! isPreviewMode;
	const disabled = isPreviewMode || isSiteSettingsActive;

	return {
		title: __( 'Add element', 'elementor' ),
		icon: () => <PlusIcon />,
		onClick: () => openRoute( 'panel/elements/categories' ),
		selected,
		disabled,
	};
}
