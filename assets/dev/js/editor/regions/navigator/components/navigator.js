import { Provider, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { Empty, Header } from './';
import { ElementItem } from './items';
import Icon from 'elementor-app/ui/atoms/icon';

const NavigatorBody = () => {
	/**
	 * Whether the there are elements to display except of the document root.
	 *
	 * @type {boolean}
	 */
	const hasElements = useSelector(
		( state ) => Object.keys( state[ 'document/elements' ] ).length > 1
	);

	/**
	 * Close the navigator view.
	 *
	 * @void
	 */
	const handleClose = useCallback( () => {
		$e.run( 'navigator/close' );
	}, [] );

	return (
		<div id="elementor-navigator__inner">
			<Header onClose={ handleClose } />
			<div id="elementor-navigator__elements" role="tree">
				{ hasElements ?
					<ElementItem itemId="document" level={ 0 } /> :
					<Empty /> }
			</div>
			<footer id="elementor-navigator__footer" role="separator" aria-orientation="horizontal">
				<Icon className="eicon-ellipsis-h" />
			</footer>
		</div>
	);
};

export function Navigator() {
	return (
		<Provider store={ $e.store.getReduxStore() }>
			<NavigatorBody />
		</Provider>
	);
}

export default Navigator;
