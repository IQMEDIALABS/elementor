import Header from './header';
import Icon from 'elementor-app/ui/atoms/icon';
import ItemList from './item-list';
import { ListStateProvider } from '../context/list-state-context';
import PropTypes from 'prop-types';
import { Droppable, DragDropContext } from 'react-beautiful-dnd';
import useElement from 'elementor-regions/navigator/hooks/use-element';
import Empty from 'elementor-regions/navigator/components/empty';

export default function Navigator( { documents } ) {
	// We should get the document element in order to check further whether it has children, if not - empty state will
	// be displayed. When header and footer documents will be added to the navigator, it won't be necessary, sine the
	// navigator will never be empty.
	const { element } = useElement( documents[ 0 ].id );

	const handleClose = () => {
		$e.run( 'navigator/close' );
	};

	const handleDragEnd = ( { draggableId, destination } ) => {
		$e.run( 'document/elements/move', {
			container: elementor.getContainer( draggableId ),
			target: elementor.getContainer( destination.droppableId ),
			options: {
				at: destination.index,
			},
		} );
	};

	return (
		<div id="elementor-navigator__inner">
			<ListStateProvider>
				<Header onClose={ handleClose } />
				<DragDropContext onDragEnd={ handleDragEnd }>
					<Droppable droppableId="root">
						{ ( provided ) => (
							<div ref={ provided.innerRef } id="elementor-navigator__elements">
								{ element.elements.length ?
									<ItemList elements={documents}/> :
									<Empty/> }
							</div>
						) }
					</Droppable>
				</DragDropContext>
				<div id="elementor-navigator__footer">
					<Icon className="eicon-ellipsis-h" />
				</div>
			</ListStateProvider>
		</div>
	);
}

Navigator.propTypes = {
	documents: PropTypes.array,
};
