import { useState, useRef, forwardRef } from 'react';
import { Box, Stack, IconButton, Tooltip } from '@elementor/ui';
import PromptAutocomplete from './prompt-autocomplete';
import EnhanceButton from '../../form-media/components/enhance-button';
import GenerateSubmit from '../../form-media/components/generate-submit';
import ArrowLeftIcon from '../../../icons/arrow-left-icon';
import EditIcon from '../../../icons/edit-icon';
import usePromptEnhancer from '../../../hooks/use-prompt-enhancer';

const PROMPT_SUGGESTIONS = Object.freeze( [
	{ text: __( 'Hero section with an image, headline, and call-to-action button about', 'elementor' ) },
	{ text: __( 'Our Services section with a 3-icons and text blocks for', 'elementor' ) },
	{ text: __( 'Testimonial section with an image-left, text-right style about', 'elementor' ) },
	{ text: __( 'About us section, combining company history and values about', 'elementor' ) },
	{ text: __( 'A short section about the importance of', 'elementor' ) },
	{ text: __( 'FAQ section for ensuring easy navigation and clear answers about', 'elementor' ) },
	{ text: __( 'Statistics display in a 3-column layout, with numbers and icons about', 'elementor' ) },
] );

const IconButtonWithTooltip = ( { tooltip, ...props } ) => (
	<Tooltip title={ tooltip }>
		<Box component="span" sx={ { cursor: props.disabled ? 'default' : 'pointer' } }>
			<IconButton { ...props } />
		</Box>
	</Tooltip>
);

IconButtonWithTooltip.propTypes = {
	tooltip: PropTypes.string,
	disabled: PropTypes.bool,
};

const BackButton = ( props ) => (
	<IconButtonWithTooltip size="small" color="secondary" tooltip={ __( 'Back to results', 'elementor' ) } { ...props }>
		<ArrowLeftIcon />
	</IconButtonWithTooltip>
);

const EditButton = ( props ) => (
	<IconButtonWithTooltip
		size="small"
		color="primary"
		tooltip={ __( 'Edit prompt', 'elementor' ) }
		{ ...props }
	>
		<EditIcon />
	</IconButtonWithTooltip>
);

const GenerateButton = ( props ) => (
	<GenerateSubmit
		size="small"
		fullWidth={ false }
		{ ...props }
	>
		{ __( 'Generate', 'elementor' ) }
	</GenerateSubmit>
);

const PromptForm = forwardRef( ( { isActive, isLoading, showActions = false, onSubmit, onBack, onEdit }, ref ) => {
	const [ prompt, setPrompt ] = useState( '' );
	const { isEnhancing, enhance } = usePromptEnhancer( prompt, 'layout' );
	const previousPrompt = useRef( '' );

	const isInteractionsDisabled = isEnhancing || isLoading || ! isActive || '' === prompt;

	const handleBack = () => {
		setPrompt( previousPrompt.current );
		onBack();
	};

	const handleEdit = () => {
		previousPrompt.current = prompt;
		onEdit();
	};

	return (
		<Box
			component="form"
			onSubmit={ ( e ) => onSubmit( e, prompt ) }
			sx={ { p: 2 } }
			display="flex"
			alignItems="center"
			gap={ 1 }
		>
			<Stack direction="row" flexGrow={ 1 } spacing={ 1 }>
				{
					showActions && (
						isActive ? (
							<BackButton disabled={ isLoading || isEnhancing } onClick={ handleBack } />
						) : (
							<EditButton disabled={ isLoading } onClick={ handleEdit } />
						)
					)
				}

				<PromptAutocomplete
					value={ prompt }
					disabled={ isLoading || ! isActive || isEnhancing }
					onSubmit={ ( e ) => onSubmit( e, prompt ) }
					options={ PROMPT_SUGGESTIONS }
					getOptionLabel={ ( option ) => option.text ? option.text + '...' : prompt }
					onChange={ ( _, selectedValue ) => setPrompt( selectedValue.text + ' ' ) }
					renderInput={ ( params ) => (
						<PromptAutocomplete.TextInput
							{ ...params }
							ref={ ref }
							onChange={ ( e ) => setPrompt( e.target.value ) }
							placeholder={ __( "Press '/' for suggested prompts or describe the layout you want to create", 'elementor' ) }
						/>
					) }
				/>
			</Stack>

			<EnhanceButton
				size="small"
				disabled={ isInteractionsDisabled }
				isLoading={ isEnhancing }
				onClick={ () => enhance().then( ( { result } ) => setPrompt( result ) ) }
			/>

			<GenerateButton disabled={ isInteractionsDisabled } />
		</Box>
	);
} );

PromptForm.propTypes = {
	isActive: PropTypes.bool,
	isLoading: PropTypes.bool,
	showActions: PropTypes.bool,
	onSubmit: PropTypes.func.isRequired,
	onBack: PropTypes.func.isRequired,
	onEdit: PropTypes.func.isRequired,
};

export default PromptForm;
