import { Box, IconButton, IconButtonProps, Tooltip } from '@elementor/ui';

type Props = IconButtonProps & {
	title?: string;
	selected?: boolean;
}

export default function ToolbarMenuItem( { title, ...props }: Props ) {
	return (
		<Tooltip title={ title }>
			{ /* @see https://mui.com/material-ui/react-tooltip/#disabled-elements */ }
			<Box component="span" aria-label={ undefined }>
				<IconButton { ...props } aria-label={ title } size="small" />
			</Box>
		</Tooltip>
	);
}
