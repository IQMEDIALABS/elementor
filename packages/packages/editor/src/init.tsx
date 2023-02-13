import * as ReactDOM from 'react-dom';
import Shell from './components/shell';
import { ThemeProvider } from '@elementor/ui';
import { StoreProvider, createStore } from '@elementor/store';
import { dispatchReadyEvent } from '@elementor/v1-adapters';
import { SettingsProvider, Settings } from './contexts/settings-context';

export default function init( domElement: HTMLElement, settings: Settings ): void {
	const store = createStore();

	dispatchReadyEvent();

	ReactDOM.render( (
		<SettingsProvider settings={ settings }>
			<StoreProvider store={ store }>
				<ThemeProvider>
					<Shell />
				</ThemeProvider>
			</StoreProvider>
		</SettingsProvider>
	), domElement );
}
