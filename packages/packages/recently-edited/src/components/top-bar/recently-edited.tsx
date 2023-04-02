import {
	bindMenu,
	usePopupState,
	bindTrigger,
	Stack,
	Menu,
	Button,
} from '@elementor/ui';
import { ChevronDownIcon } from '@elementor/icons';
import { useActiveDocument, useHostDocument } from '@elementor/documents';
import SettingsButton from './settings-button';
import Indicator from './indicator';
import PostsList from './posts-list';
import useRecentPosts from '../../hooks/use-recent-posts';

export default function RecentlyEdited() {
	const activeDocument = useActiveDocument();
	const hostDocument = useHostDocument();
	const recentPosts = useRecentPosts();

	const popupState = usePopupState( {
		variant: 'popover',
		popupId: 'elementor-v2-top-bar-recently-edited',
	} );

	const document = activeDocument && activeDocument.type.value !== 'kit'
		? activeDocument
		: hostDocument;

	if ( ! document ) {
		return null;
	}

	return (
		<Stack direction="row" spacing={ 1 } sx={ { paddingInlineStart: 1, cursor: 'default' } }>
			<Button
				color="inherit"
				endIcon={ <ChevronDownIcon /> }
				{ ...bindTrigger( popupState ) }
			>
				<Indicator
					title={ document.title }
					status={ document.status }
				/>
			</Button>

			<Menu { ...bindMenu( popupState ) } >
				<PostsList recentPosts={ recentPosts } />
			</Menu>

			<SettingsButton type={ document.type } />
		</Stack>
	);
}
