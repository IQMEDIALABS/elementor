import { useState, useMemo } from 'react';
import Taxonomy from '../models/taxonomy';
import Collapse from './collapse';
import SearchInput from './search-input';
import { Checkbox, Text } from '@elementor/app-ui';
import { sprintf } from '@wordpress/i18n';
import { appsEventTrackingDispatch } from 'elementor-app/event-track/apps-event-tracking';

const MIN_TAGS_LENGTH_FOR_SEARCH_INPUT = 15;

const TaxonomiesFilterList = ( props ) => {
	const [ isOpen, setIsOpen ] = useState( props.taxonomiesByType.isOpenByDefault );
	const [ search, setSearch ] = useState( '' );
	const category = ( '/favorites' === props.category ? 'favorites' : 'all kits' );
	const taxonomies = useMemo( () => {
		if ( ! search ) {
			return props.taxonomiesByType.data;
		}

		const lowerCaseSearch = search.toLowerCase();

		return props.taxonomiesByType.data.filter(
			( tag ) => tag.text.toLowerCase().includes( lowerCaseSearch ),
		);
	}, [ props.taxonomiesByType.data, search ] );
	const eventTracking = ( command, eventName, section, action, item ) => appsEventTrackingDispatch(
		command,
		{
			category,
			section,
			item,
			action: action ? 'checked' : 'unchecked',
			event: eventName,
			source: 'home page',
		},
	);
	return (
		<Collapse
			className="e-kit-library__tags-filter-list"
			title={ props.taxonomiesByType.label }
			isOpen={ isOpen }
			onChange={ () => {
				setIsOpen( ! isOpen );
			} }
			onClick={ ( collapseState, title ) => {
				props.onCollapseChange?.( collapseState, title );
			} }
		>
			{
				props.taxonomiesByType.data.length >= MIN_TAGS_LENGTH_FOR_SEARCH_INPUT &&
					<SearchInput
						size="sm"
						className="e-kit-library__tags-filter-list-search"
						// Translators: %s is the taxonomy type.
						placeholder={ sprintf( __( 'Search %s...', 'elementor' ), props.taxonomiesByType.label ) }
						value={ search }
						onChange={ setSearch }
						onFilter={ () => props.onFilter?.( search ) }
					/>
			}
			<div className="e-kit-library__tags-filter-list-container">
				{ 0 === taxonomies.length && <Text>{ __( 'No Results Found', 'elementor' ) }</Text> }
				{
					taxonomies.map( ( taxonomy ) => (
						// eslint-disable-next-line jsx-a11y/label-has-for
						<label key={ taxonomy.text } className="e-kit-library__tags-filter-list-item">
							<Checkbox
								checked={ props.selected[ taxonomy.type ]?.includes( taxonomy.text ) || false }
								onChange={ ( e ) => {
									const checked = e.target.checked;
									eventTracking( 'kit-library/filter', 'sidebar section filters interaction', taxonomy.type, checked, taxonomy.text );

									props.onSelect( taxonomy.type, ( prev ) => {
										return checked
											? [ ...prev, taxonomy.text ]
											: prev.filter( ( tagId ) => tagId !== taxonomy.text );
									} );
								} } />
							{ taxonomy.text }
						</label>
					) )
				}
			</div>
		</Collapse>
	);
};

TaxonomiesFilterList.propTypes = {
	taxonomiesByType: PropTypes.shape( {
		key: PropTypes.string,
		label: PropTypes.string,
		data: PropTypes.arrayOf( PropTypes.instanceOf( Taxonomy ) ),
		isOpenByDefault: PropTypes.bool,
	} ),
	selected: PropTypes.objectOf( PropTypes.arrayOf( PropTypes.string ) ),
	onSelect: PropTypes.func,
	onFilter: PropTypes.func,
	onCollapseChange: PropTypes.func,
};

export default React.memo( TaxonomiesFilterList );
