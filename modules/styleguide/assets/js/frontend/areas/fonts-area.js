import React, { useContext, useEffect, useRef } from 'react';
import AreaTitle from './area-title';
import Section from '../components/section';
import { ActiveElementContext } from '../providers/active-element-provider';
import { addEventListener, AFTER_COMMAND_EVENT } from '../utils/top-events';
import useSettings from '../hooks/use-settings';
import styled from 'styled-components';
import Loader from '../components/global/loader';
import Font from '../components/item/font';

const Wrapper = styled.div`
	width: 100%;
	margin-top: 95px;

	@media (max-width: 640px) {
		margin-top: 45px;
	}
`;

export default function FontsArea() {
	const ref = useRef( null );
	const { setActive, unsetActive } = useContext( ActiveElementContext );

	const { isLoading, settings } = useSettings( { type: 'typography' } );

	const onPopoverToggle = ( event ) => {
		const name = event.detail.container.model.attributes.name;

		if ( ! name.includes( 'typography' ) ) {
			return;
		}

		if ( event.detail.visible ) {
			setActive( event.detail.container.id, 'typography' );
		} else {
			unsetActive( event.detail.container.id, 'typography' );
		}
	};

	const onPanelShow = ( event ) => {
		const command = 'panel/global/global-typography';
		if ( event.detail.command !== command ) {
			return;
		}

		if ( event.detail.args.shouldNotScroll ) {
			return;
		}

		setTimeout( () => {
			ref.current.scrollIntoView( { behavior: 'smooth' } );
		}, 100 );
	};

	useEffect( () => {
		addEventListener( 'elementor/popover/toggle', onPopoverToggle );
		addEventListener( AFTER_COMMAND_EVENT, onPanelShow );

		return () => {
			removeEventListener( 'elementor/popover/toggle', onPopoverToggle );
			removeEventListener( AFTER_COMMAND_EVENT, onPanelShow );
		};
	}, [] );

	if ( isLoading ) {
		return <Loader />;
	}

	return (
		<Wrapper ref={ ref }>
			<AreaTitle name="fonts">Global Fonts</AreaTitle>
			<Section title="System Fonts"
				source={ settings.system_typography }
				type="system"
				flex={ 'column' }
				component={ Font }
			/>
			<Section title="Custom Fonts"
				source={ settings.custom_typography }
				type="custom"
				flex={ 'column' }
				component={ Font }
			/>
		</Wrapper>
	);
}
