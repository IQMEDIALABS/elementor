import { useContext } from 'react';

import { ImportContext } from '../../../../../context/import-context/import-context-provider';

import PluginsSelection from '../../../../../shared/plugins-selection/plugins-selection';
import Heading from 'elementor-app/ui/atoms/heading';

import usePlugins from '../../../../../hooks/use-plugins';
import usePluginsData from '../../../../../hooks/use-plugins-data';

export default function PluginsToImport( { plugins } ) {
	if ( ! plugins?.length ) {
		return null;
	}

	const importContext = useContext( ImportContext ),
		{ PLUGIN_STATUS_MAP } = usePlugins(),
		{ PLUGINS_KEYS } = usePluginsData(),
		{ name, status } = plugins[ 1 ], // In case that Elementor Pro exist it will always be the second item.
		// The Elementor Pro plugin should be displayed in the list only if its status is inactive.
		pluginsToImport = ( PLUGINS_KEYS.ELEMENTOR_PRO === name && PLUGIN_STATUS_MAP.INACTIVE !== status ) ? plugins.splice( 1 ) : plugins,
		isAllRequiredPluginsSelected = pluginsToImport.length === importContext.data.plugins.length,
		initialSelected = pluginsToImport.map( ( plugin, index ) => index ),
		handleOnSelect = ( selectedPlugins ) => importContext.dispatch( { type: 'SET_PLUGINS', payload: selectedPlugins } );

	if ( ! pluginsToImport.length ) {
		return null;
	}

	return (
		<div className="e-app-import-plugins__section">
			<Heading variant="h5" tag="h3" className="e-app-import-plugins__section-heading">
				{
					isAllRequiredPluginsSelected ?
					__( 'Plugins to add:', 'elementor' ) :
					__( 'Missing Required Plugins:', 'elementor' )
				}
			</Heading>

			<PluginsSelection
				plugins={ pluginsToImport }
				initialSelected={ initialSelected }
				onSelect={ handleOnSelect }
				layout={ [ 3, 1, 1 ] }
			/>
		</div>
	);
}

PluginsToImport.propTypes = {
	plugins: PropTypes.array,
};
