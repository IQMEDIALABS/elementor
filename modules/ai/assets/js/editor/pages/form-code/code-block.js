import { useRef } from 'react';
import { Box, Button } from '@elementor/ui';
import Textarea from '../../components/textarea';

const CodeBlock = ( { node, inline, children, defaultValue, onInsert, ...props } ) => {
	const codeBlockInput = useRef( null );

	if ( inline ) {
		return <code { ...props } />;
	}

	return (
		<Box sx={ { position: 'relative' } }>
			<Textarea
				fullWidth
				ref={ codeBlockInput }
				defaultValue={ children[ 0 ] }
				sx={ { mb: 3 } }
				helperText={ __( 'Code generated by AI may be inaccurate.', 'elementor' ) }
				{ ...props }
			/>

			<Button
				size="small"
				variant="contained"
				onClick={ () => onInsert( defaultValue + '\n' + codeBlockInput.current.value ) }
				sx={ { position: 'absolute', right: '11px', bottom: '44px' } }
			>
				{ __( 'Insert', 'elementor' ) }
			</Button>
		</Box>
	);
};

CodeBlock.propTypes = {
	node: PropTypes.object,
	inline: PropTypes.bool,
	children: PropTypes.arrayOf( PropTypes.node ).isRequired,
	defaultValue: PropTypes.string,
	onInsert: PropTypes.func.isRequired,
};

export default CodeBlock;
