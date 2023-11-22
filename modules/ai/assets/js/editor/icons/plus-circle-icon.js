import React from 'react';
import { SvgIcon } from '@elementor/ui';

const PlusCircleIcon = React.forwardRef( ( props, ref ) => {
	return (
		<SvgIcon viewBox="0 0 24 24" { ...props } ref={ ref }>
			<g clipPath="url(#clipPath)">
				<path fillRule="evenodd" clipRule="evenodd" d="M9.99967 2.24375C5.71593 2.24375 2.24326 5.71642 2.24326 10.0002C2.24326 14.2839 5.71593 17.7566 9.99967 17.7566C14.2834 17.7566 17.7561 14.2839 17.7561 10.0002C17.7561 5.71642 14.2834 2.24375 9.99967 2.24375ZM0.833008 10.0002C0.833008 4.93755 4.93706 0.833496 9.99967 0.833496C15.0623 0.833496 19.1663 4.93755 19.1663 10.0002C19.1663 15.0628 15.0623 19.1668 9.99967 19.1668C4.93706 19.1668 0.833008 15.0628 0.833008 10.0002ZM9.99967 6.47452C10.3891 6.47452 10.7048 6.79022 10.7048 7.17965V9.29503H12.8202C13.2096 9.29503 13.5253 9.61073 13.5253 10.0002C13.5253 10.3896 13.2096 10.7053 12.8202 10.7053H10.7048V12.8207C10.7048 13.2101 10.3891 13.5258 9.99967 13.5258C9.61024 13.5258 9.29455 13.2101 9.29455 12.8207V10.7053H7.17916C6.78973 10.7053 6.47403 10.3896 6.47403 10.0002C6.47403 9.61073 6.78973 9.29503 7.17916 9.29503H9.29455V7.17965C9.29455 6.79022 9.61024 6.47452 9.99967 6.47452Z" />
			</g>
			<defs>
				<clipPath id="clipPath">
					<rect width="24" height="24" />
				</clipPath>
			</defs>
		</SvgIcon>
	);
} );

export default PlusCircleIcon;
