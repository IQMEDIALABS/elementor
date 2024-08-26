import { Infotip } from '@elementor/ui';
import * as EditorAppBar from '@elementor/editor-app-bar';
import { __ } from '@wordpress/i18n';
import * as React from 'react';
import RocketIcon from '@elementor/icons/RocketIcon';
import ReminderModal from './components/reminder-modal';
import { useState, useEffect } from "react";
import { __privateListenTo as listenTo, commandEndEvent } from "@elementor/editor-v1-adapters";


const Icon = () => {
	const [ hasRoot, setHasRoot ] = useState(false);
	const [ closedForFirstTime, setClosedForFirstTime ] = useState(null);

	const fetchStatus = async () => {
		const response = await fetch( `${ elementorCommon.config.urls.rest }elementor/v1/checklist/user_progress`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': elementorWebCliConfig.nonce,
			},
		} );
		const data = await response.json();
		console.log(data);
		setClosedForFirstTime(data.data.first_closed_checklist_in_editor);

	};


	useEffect(()=> {
		return listenTo(commandEndEvent('checklist/toggle-popup'), (e)=>{
			if(e.args.isOpen) {
				setHasRoot(true)
			} else {
				setHasRoot( false )
			}

		})

	}, [hasRoot])

	useEffect( () => {
		fetchStatus();
	}, [] );

	if ( hasRoot ) {
		return (<RocketIcon />)
	}
	else { return (
		<Infotip placement="bottom-start" content={ <ReminderModal setHasRoot={setHasRoot}/> } open={ !hasRoot } disableHoverListener={ true }
		         componentsProps={{
			         tooltip: {
				         sx: {
							 ml: -2,
					         mt: 4,
					         '& .MuiTooltip-arrow': {
						         color: 'common.white',
						         ml: 1,
					         },
				         },
			         },
		         }}
		>
			<RocketIcon />
		</Infotip>
	);}

};

export const editorV2 = () => {
	const { utilitiesMenu } = EditorAppBar;

	utilitiesMenu.registerLink( {
		id: 'app-bar-menu-item-checklist',
		priority: 5,
		useProps: () => {
			return {
				title: __( 'Checklist', 'elementor' ),
				icon: () => <Icon />,
				onClick: () => {
					$e.commands.run( 'checklist/toggle-popup' );
				},
			};
		},
	} );
};
