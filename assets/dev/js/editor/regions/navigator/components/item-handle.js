import { arrayToClassName } from 'elementor-app/utils/utils';
import { forwardRef, useCallback } from 'react';
import { ItemIcon, ItemTitle } from './';
import { useItemContext } from '../context/item-context';
import Icon from 'elementor-app/ui/atoms/icon';
import PropTypes from 'prop-types';

function ItemHandle( { className, style, onToggleFolding, onTitleEdit, children, ...props }, ref ) {
	const { item, level } = useItemContext();

	/**
	 * Toggle the element folding state in the store.
	 *
	 * @void
	 */
	const handleToggleFolding = useCallback(
		( e ) => {
			e.stopPropagation();
			onToggleFolding();
		},
		[ onToggleFolding ]
	);

	return (
		<div
			{ ...props }
			ref={ ref }
			className={ arrayToClassName( [
				{ 'elementor-navigator__item': true },
				{ [ className ]: true },
			] ) }
			style={ {
				[ `padding${ elementorCommon.config.isRTL ? 'Right' : 'Left' }` ]: level * 10,
				...style,
			} }
			tabIndex={ -1 }>
			{ false === onToggleFolding ||
				<div className="elementor-navigator__element__list-toggle"
					title={ __( 'Toggle folding' ) }
					role="button"
					onClick={ handleToggleFolding }>
					<Icon className="eicon-sort-down"/>
				</div>
			}
			<ItemIcon icon={ item.icon } />
			<ItemTitle title={ item.title } onTitleEdit={ onTitleEdit } />
			{ children }
		</div>
	);
}

ItemHandle = forwardRef( ItemHandle );

ItemHandle.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	onToggleFolding: PropTypes.func,
	onTitleEdit: PropTypes.func,
	children: PropTypes.node,
};

export { ItemHandle };
export default ItemHandle;
