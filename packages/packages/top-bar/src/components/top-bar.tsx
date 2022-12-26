import React from 'react';

export const TopBar = () => {
	return (
		<div style={ {
			background: '#000',
			height: 'var(--e-editor-v2-top-bar-height, 50px)',
			width: '100%',
		} }>
			<img
				alt="Elementor Logo"
				src="https://elementor.com/marketing/wp-content/uploads/2021/10/Elementor-Logo-Symbol-Red.png"
				style={ {
					height: '90%',
					marginTop: '2px',
					marginLeft: '4px',
				} }
			/>
		</div>
	);
};

export default TopBar;
