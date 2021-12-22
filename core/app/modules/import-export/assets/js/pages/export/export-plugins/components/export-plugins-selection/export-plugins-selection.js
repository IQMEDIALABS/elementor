import { useContext, useEffect } from 'react';

import { ExportContext } from '../../../../../context/export-context/export-context-provider';

import PluginsSelection from '../../../../../shared/plugins-selection/plugins-selection';
import Loader from '../../../../../ui/loader/loader';

import usePlugins, { PLUGIN_STATUS_MAP } from '../../../../../hooks/use-plugins';
import usePluginsData, { PLUGINS_KEYS } from '../../../../../hooks/use-plugins-data';

export default function ExportPluginsSelection() {
	const exportContext = useContext( ExportContext ),
		{ response } = usePlugins(),
		{ pluginsData } = usePluginsData( response.data ),
		activePlugins = pluginsData.filter( ( { status } ) => PLUGIN_STATUS_MAP.ACTIVE === status ),
		handleOnSelect = ( selectedPlugins ) => exportContext.dispatch( { type: 'SET_PLUGINS', payload: selectedPlugins } ),
		getInitialSelected = () => {
			// Elementor Core will always be th
			const initialSelected = [ 0 ];

			// In case that Elementor Pro appears in the list it will always be second and should always be selected by default.
			if ( activePlugins.length > 1 && PLUGINS_KEYS.ELEMENTOR_PRO === activePlugins[ 1 ].name ) {
				initialSelected.push( 1 );
			}

			return initialSelected;
		};

	if ( ! response.data ) {
		return <Loader absoluteCenter />;
	}

	return (
		<PluginsSelection
			plugins={ activePlugins }
			initialSelected={ getInitialSelected() }
			initialDisabled={ [ 0 ] /* Elementor Core will always be first and should always be disabled */ }
			layout={ [ 3, 1 ] }
			withStatus={ false }
			onSelect={ handleOnSelect }
		/>
	);
}
