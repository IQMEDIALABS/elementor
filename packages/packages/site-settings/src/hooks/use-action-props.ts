import { __ } from '@wordpress/i18n';
import { runCommand, useRouteStatus } from '@elementor/v1-adapters';
import { AdjustmentsHorizontalIcon } from '@elementor/icons';

export default function useActionProps() {
	const { isActive, isBlocked } = useRouteStatus( 'panel/global', {
		blockOnKitRoutes: false,
	} );

	return {
		title: __( 'Site settings', 'elementor' ),
		icon: AdjustmentsHorizontalIcon,
		onClick: () => (
			isActive
				? runCommand( 'panel/global/close' )
				: runCommand( 'panel/global/open' )
		),
		selected: isActive,
		disabled: isBlocked,
	};
}
