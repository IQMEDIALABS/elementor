import * as React from 'react';
import { PopoverMenu } from '@elementor/top-bar';
// TODO: Should the top bar expose those?
import { Divider, MenuProps, styled } from '@elementor/ui';
import { documentOptionsMenu } from '../../menus';

const { useMenuItems } = documentOptionsMenu;

// CSS hack to hide dividers when a group is rendered empty (due to a limitation in our locations' mechanism).
// It doesn't cover all the cases (i.e. when there are multiple dividers at the end), but it's good enough for our use-case.
const StyledPopoverMenu = styled( PopoverMenu )`
	& > .MuiPopover-paper > .MuiList-root > .MuiDivider-root {
		&:only-child, /* A divider is being rendered lonely */
		&:last-child, /* The last group renders empty but renders a divider */
		& + .MuiDivider-root /* Multiple dividers due to multiple empty groups */ {
			display: none;
		}
	}
`;

export default function PrimaryActionMenu( props: MenuProps ) {
	const { save: saveActions, default: defaultActions } = useMenuItems();

	return (
		<StyledPopoverMenu
			{ ...props }
			anchorOrigin={ {
				vertical: 'bottom',
				horizontal: 'right',
			} }
			transformOrigin={ {
				vertical: 'top',
				horizontal: 'right',
			} }
			PaperProps={ {
				sx: { mt: 2, ml: 3 }, // TODO: Check RTL.
			} }
		>
			{ saveActions.map( ( { MenuItem, id } ) => ( [
				<Divider key={ `${ id }-divider` } orientation="horizontal" />,
				<MenuItem key={ id } />,
			] ) ) }

			{ defaultActions.length > 0 && <Divider orientation="horizontal" /> }

			{ defaultActions.map( ( { MenuItem, id } ) => <MenuItem key={ id } /> ) }
		</StyledPopoverMenu>
	);
}
