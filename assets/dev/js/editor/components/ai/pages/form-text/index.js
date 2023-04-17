import { Box, Button, Alert, Grid, Stack } from '@elementor/ui';
import { AIIcon, MessageIcon, ShrinkIcon, ExpandIcon } from '@elementor/icons';
import { useRef } from 'react';
import Loader from '../../components/loader';
import PromptSearch from '../../components/prompt-search';
import TextArea from '../../components/text-area';
import PromptSuggestions from '../../components/prompt-suggestions';
import PromptActionSelection from '../../components/prompt-action-selection';
import GenerateButton from '../../components/generate-button';
import PromptAction from '../../components/prompt-action';
import PromptCredits from '../../components/prompt-credits';
import PromptErrorMessage from '../../components/prompt-error-message';
import useTextPrompt from '../../hooks/use-text-prompt';
import { textAutocomplete, textareaAutocomplete, vocalTones, translateLanguages } from '../../actions-data';

const promptActions = [
	{ label: __( 'Simplify language', 'elementor' ), icon: <MessageIcon />, value: 'Simplify the language of the following message' },
	{ label: __( 'Make it longer', 'elementor' ), icon: <ExpandIcon />, value: 'Make the following message longer' },
	{ label: __( 'Make it shorter', 'elementor' ), icon: <ShrinkIcon />, value: 'Make the following message shorter' },
	{ label: __( 'Fix spelling & grammar', 'elementor' ), icon: <AIIcon />, value: 'Fix the spelling and grammar of the following message' },
];

const promptInstructions = [
	{ label: __( 'Change tone', 'elementor' ), options: vocalTones, getInstruction: ( value ) => `Change the tone of the following message to ${ value }` },
	{ label: __( 'Translate to', 'elementor' ), options: translateLanguages, getInstruction: ( value ) => `Translate the following message to ${ value }` },
];

const FormText = (
	{
		type,
		controlType,
		onClose,
		getControlValue,
		setControlValue,
		additionalOptions,
		credits: initialCredits,
	},
) => {
	const initialValue = getControlValue() === additionalOptions?.defaultValue ? '' : getControlValue();
	const {
		prompt,
		setPrompt,
		send,
		isLoading,
		error,
		resetError,
		result,
		setResult,
		sendFeedback,
		credits,
	} = useTextPrompt( { initialResult: initialValue, initialCredits } );

	const searchField = useRef( null );

	const autocompleteItems = 'textarea' === type ? textareaAutocomplete : textAutocomplete;

	const showSuggestions = ! prompt;

	const handleSubmit = ( event ) => {
		event.preventDefault();

		send( prompt );
	};

	const handleCustomInstruction = async ( instruction ) => send( result, instruction );

	const handleSuggestion = ( suggestion ) => {
		setPrompt( suggestion + ' ' );
		searchField.current.focus();
	};

	const applyPrompt = () => {
		sendFeedback();

		setControlValue( result );

		onClose();
	};

	if ( isLoading ) {
		return <Loader />;
	}

	return (
		<>
			{ error && <PromptErrorMessage error={ error } onClose={ resetError } sx={ { mb: 6 } } /> }

			{ ! result && (
				<Box component="form" onSubmit={ handleSubmit }>
					<Box sx={ { mb: 6 } }>
						<PromptSearch
							ref={ searchField }
							placeholder={ __( 'Describe the text and tone you want to use...', 'elementor' ) }
							name="prompt"
							value={ prompt }
							onChange={ ( event ) => setPrompt( event.target.value ) }
						/>
					</Box>

					{ showSuggestions && (
						<PromptSuggestions
							suggestions={ autocompleteItems }
							onSelect={ handleSuggestion }
							suggestionFilter={ ( suggestion ) => suggestion + '...' }
						/>
					) }

					<Stack direction="row" alignItems="center" justifyContent="space-between" sx={ { py: 4, mt: 8 } }>
						<PromptCredits credits={ credits } />

						<GenerateButton>
							{ __( 'Generate text', 'elementor' ) }
						</GenerateButton>
					</Stack>
				</Box>
			) }

			{ result && (
				<Box sx={ { mt: 3 } }>
					<TextArea
						value={ result }
						onChange={ ( event ) => setResult( event.target.value ) }
						helperText={ __( 'Text generated by A.I. may be inaccurate or offensive.', 'elementor' ) }
					/>

					<Grid container spacing={ 3 } sx={ { mt: 6 } }>
						{
							promptActions.map( ( { label, icon, value } ) => (
								<Grid item key={ label }>
									<PromptAction label={ label } icon={ icon } onClick={ () => handleCustomInstruction( value ) } />
								</Grid>
							) )
						}
					</Grid>

					<Grid container spacing={ 3 } sx={ { mt: 6 } }>
						{
							promptInstructions.map( ( { label, options, getInstruction } ) => (
								<Grid item key={ label }>
									<PromptActionSelection
										label={ label }
										options={ options }
										onChange={ ( event ) => handleCustomInstruction( getInstruction( event.target.value ) ) }
									/>
								</Grid>
							) )
						}
					</Grid>

					<Stack direction="row" alignItems="center" justifyContent="space-between" sx={ { my: 8 } }>
						<PromptCredits credits={ credits } />

						<Stack direction="row" justifyContent="flex-end" gap={ 3 }>
							<Button size="small" color="secondary" variant="text" onClick={ () => setResult( '' ) }>
								{ __( 'New prompt', 'elementor' ) }
							</Button>
							<Button size="small" variant="contained" color="primary" onClick={ applyPrompt }>
								{ __( 'Use text', 'elementor' ) }
							</Button>
						</Stack>
					</Stack>
				</Box>
			) }
		</>
	);
};

export default FormText;
