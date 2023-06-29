import * as React from 'react';
import { SvgIcon, SvgIconProps } from '@elementor/ui';

const HeaderTemplateIcon = React.forwardRef( ( props: SvgIconProps, ref ) => {
	return (
		<SvgIcon viewBox="0 0 24 24" { ...props } ref={ ref }>
			<path fillRule="evenodd" clipRule="evenodd" d="M5 4.75C4.86193 4.75 4.75 4.86193 4.75 5V7.25H19.25V5C19.25 4.86193 19.1381 4.75 19 4.75H5ZM20.75 5C20.75 4.0335 19.9665 3.25 19 3.25H5C4.0335 3.25 3.25 4.0335 3.25 5V19C3.25 19.9665 4.0335 20.75 5 20.75H19C19.9665 20.75 20.75 19.9665 20.75 19V5ZM19.25 8.75H4.75V19C4.75 19.1381 4.86193 19.25 5 19.25H19C19.1381 19.25 19.25 19.1381 19.25 19V8.75Z" />
		</SvgIcon>
	);
} );

export default HeaderTemplateIcon;
