import { useContext } from 'react';

import { Context } from '../../../../../context/context-provider';

import PluginsSelection from '../../../../../shared/plugins-selection/plugins-selection';
import Heading from 'elementor-app/ui/atoms/heading';

export default function PluginsToImport( { plugins } ) {
	const context = useContext( Context ),
		isAllRequiredPluginsSelected = context.data.requiredPlugins.length === context.data.plugins.length,
		handleOnSelect = ( selectedPlugins ) => context.dispatch( { type: 'SET_PLUGINS', payload: selectedPlugins } );

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
				plugins={ plugins }
				initialSelected={ plugins.map( ( plugin, index ) => index ) }
				onSelect={ handleOnSelect }
				layout={ [ 3, 1, 1 ] }
			/>
		</div>
	);
}

PluginsToImport.propTypes = {
	plugins: PropTypes.array,
};
