import { useState, useMemo } from 'react';
import Taxonomy from '../models/taxonomy';
import Collapse from './collapse';
import SearchInput from './search-input';
import { Checkbox, Text } from '@elementor/app-ui';
import { sprintf } from '@wordpress/i18n';
import { eventTrackingDispatch } from 'elementor-app/event-track/events';

const MIN_TAGS_LENGTH_FOR_SEARCH_INPUT = 15;

const TaxonomiesFilterList = ( props ) => {
	const [ isOpen, setIsOpen ] = useState( props.taxonomiesByType.isOpenByDefault );
	const [ search, setSearch ] = useState( '' );
	const category = ( '/' === props.category ? 'all kits' : 'favorites' );
	const taxonomies = useMemo( () => {
		if ( ! search ) {
			return props.taxonomiesByType.data;
		}

		const lowerCaseSearch = search.toLowerCase();

		return props.taxonomiesByType.data.filter(
			( tag ) => tag.text.toLowerCase().includes( lowerCaseSearch ),
		);
	}, [ props.taxonomiesByType.data, search ] );

	return (
		<Collapse
			className="e-kit-library__tags-filter-list"
			title={ props.taxonomiesByType.label }
			isOpen={ isOpen }
			onChange={ () => {
				setIsOpen( ! isOpen );
			} }
			category={ category }
			onClick={ ( collapseState, title ) => {
				props.onCollapseChange( collapseState, title );
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
						onSearchEvent={ () => props.onSearchEvent( search, category ) }
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
									if ( checked ) {
										eventTrackingDispatch(
											'kit-library/filter',
											{
												category,
												section: taxonomy.type,
												item: taxonomy.text,
												action: 'check',
												event: 'sidebar section filters interaction',
												source: 'home page',
											},
										);
									} else {
										eventTrackingDispatch(
											'kit-library/filter',
											{
												category,
												section: taxonomy.type,
												item: taxonomy.text,
												action: 'uncheck',
												event: 'sidebar section filters interaction',
												source: 'home page',
											},
										);
									}

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
	onSearchEvent: PropTypes.func,
	onCollapseChange: PropTypes.func,
};

export default React.memo( TaxonomiesFilterList );
