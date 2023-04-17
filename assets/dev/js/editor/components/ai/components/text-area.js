import { forwardRef } from 'react';
import { TextField } from '@elementor/ui';

const TextArea = forwardRef( ( props, ref ) => {
	return (
		<TextField
			ref={ ref }
			multiline
			fullWidth
			minRows={ 4 }
			maxRows={ 20 }
			value={ props.value }
			onChange={ props.onChange }
			helperText={ props.helperText }
			{ ...props }
		/>
	);
} );

export default TextArea;
