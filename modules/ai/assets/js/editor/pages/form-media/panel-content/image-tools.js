import { Box, Button, Typography, SvgIcon, styled, withDirection } from '@elementor/ui';
import ExpandIcon from '../../../icons/expand-icon';
import BrushIcon from '../../../icons/brush-icon';
import EvolveIcon from '../../../icons/evolve-icon';
import EnlargerIcon from '../../../icons/enlarger-icon';
import { PANELS } from '../consts/consts';
import ChevronLeftIcon from '../../../icons/chevron-left-icon';

const StyledChevronLeftIcon = withDirection( ChevronLeftIcon );

const TeaserDrawing = () => (
	<SvgIcon viewBox="0 0 184 80" sx={ { width: 184, height: 80 } }>
		<g clipPath="url(#clip0_3127_96542)">
			<path fillRule="evenodd" clipRule="evenodd" d="M49.6014 1.36364C49.6014 0.610521 48.9907 0 48.2373 0C47.4839 0 46.8731 0.610521 46.8731 1.36364C46.8731 1.9664 46.6336 2.54448 46.2072 2.9707C45.7808 3.39692 45.2025 3.63636 44.5995 3.63636C43.8461 3.63636 43.2354 4.24689 43.2354 5C43.2354 5.75311 43.8461 6.36364 44.5995 6.36364C45.2025 6.36364 45.7808 6.60308 46.2072 7.0293C46.6336 7.45552 46.8731 8.0336 46.8731 8.63636C46.8731 9.38948 47.4839 10 48.2373 10C48.9907 10 49.6014 9.38948 49.6014 8.63636C49.6014 8.0336 49.8409 7.45552 50.2673 7.0293C50.6937 6.60308 51.272 6.36364 51.875 6.36364C52.6284 6.36364 53.2392 5.75311 53.2392 5C53.2392 4.24689 52.6284 3.63636 51.875 3.63636C51.272 3.63636 50.6937 3.39692 50.2673 2.9707C49.8409 2.54448 49.6014 1.9664 49.6014 1.36364ZM48.1364 4.89917C48.1706 4.86501 48.2042 4.83041 48.2373 4.79538C48.2703 4.83041 48.304 4.86501 48.3381 4.89917C48.3723 4.93333 48.4069 4.96694 48.4419 5C48.4069 5.03306 48.3723 5.06667 48.3381 5.10083C48.304 5.13499 48.2703 5.16959 48.2373 5.20462C48.2042 5.16959 48.1706 5.13499 48.1364 5.10083C48.1022 5.06667 48.0676 5.03306 48.0326 5C48.0676 4.96694 48.1022 4.93333 48.1364 4.89917Z" fill="#69727D" />
			<path fillRule="evenodd" clipRule="evenodd" d="M66.6927 22.3677C66.6927 21.6177 66.082 21.0098 65.3286 21.0098C64.5752 21.0098 63.9644 21.6177 63.9644 22.3677C63.9644 22.9679 63.7249 23.5436 63.2985 23.968C62.8721 24.3924 62.2938 24.6309 61.6908 24.6309C60.9374 24.6309 60.3267 25.2388 60.3267 25.9888C60.3267 26.7387 60.9374 27.3467 61.6908 27.3467C62.2938 27.3467 62.8721 27.5851 63.2985 28.0096C63.7249 28.434 63.9644 29.0096 63.9644 29.6099C63.9644 30.3598 64.5752 30.9678 65.3286 30.9678C66.082 30.9678 66.6927 30.3598 66.6927 29.6099C66.6927 29.0096 66.9323 28.434 67.3586 28.0096C67.785 27.5851 68.3633 27.3467 68.9663 27.3467C69.7197 27.3467 70.3305 26.7387 70.3305 25.9888C70.3305 25.2388 69.7197 24.6309 68.9663 24.6309C68.3633 24.6309 67.785 24.3924 67.3586 23.968C66.9323 23.5436 66.6927 22.9679 66.6927 22.3677ZM65.2277 25.8884C65.2619 25.8544 65.2955 25.8199 65.3286 25.785C65.3616 25.8199 65.3953 25.8544 65.4294 25.8884C65.4636 25.9224 65.4982 25.9559 65.5333 25.9888C65.4982 26.0217 65.4636 26.0552 65.4294 26.0892C65.3953 26.1232 65.3616 26.1577 65.3286 26.1925C65.2955 26.1577 65.2619 26.1232 65.2277 26.0892C65.1935 26.0552 65.1589 26.0217 65.1239 25.9888C65.1589 25.9559 65.1935 25.9224 65.2277 25.8884Z" fill="#69727D" />
			<path d="M53.9717 12L57.2198 17.0456L3.24796 51.4731L-0.000164873 46.4275L53.9717 12Z" fill="#69727D" />
			<path d="M64.9761 5L68.2242 10.0456L57.2612 17.0387L54.013 11.9931L64.9761 5Z" fill="#E6E8EA" />
			<path fillRule="evenodd" clipRule="evenodd" d="M65.7284 9.49923L64.432 7.48537L56.5088 12.5394L57.8052 14.5533L65.7284 9.49923ZM64.9761 5L54.013 11.9931L57.2612 17.0387L68.2242 10.0456L64.9761 5Z" fill="#69727D" />
			<path fillRule="evenodd" clipRule="evenodd" d="M128 41C128 43.7687 121.671 46.2089 112.052 47.6451L114.482 74.7976C114.494 74.8647 114.5 74.9322 114.5 75C114.5 75.0001 114.5 75.0002 114.5 75.0003C114.513 75.1456 114.487 75.2779 114.43 75.3982C113.514 77.9735 103.8 80 91.95 80C79.496 80 69.4 77.7614 69.4 75C69.4 74.8146 69.4456 74.6315 69.5343 74.4513L71.2141 47.5326C62.0087 46.0835 56 43.6977 56 41C56 36.5817 72.1177 33 92 33C111.882 33 128 36.5817 128 41Z" fill="#69727D" />
			<path d="M106.685 3.08259C112.562 16.564 109.338 34.1761 106.713 41.4407C106.713 41.4407 105.151 41.9127 100.894 41.9715C96.6371 42.0303 95.0251 41.9866 95.0251 41.4558C95.0252 40.9249 94.6272 34.6461 96.4177 22.3308C98.0343 11.2116 102.692 5.02553 105.448 2.75675C105.865 2.4137 106.47 2.58777 106.685 3.08259Z" fill="#E6E8EA" />
			<path fillRule="evenodd" clipRule="evenodd" d="M104.883 4.66783C105.347 4.17219 106.14 4.35208 106.38 4.9873C108.716 11.1748 109.254 18.1507 108.889 24.5355C108.513 31.1152 107.184 36.9856 105.954 40.5842C105.778 40.6166 105.55 40.6541 105.265 40.6927C104.388 40.8119 102.974 40.9423 100.88 40.9712C98.7385 41.0008 97.3196 41.0031 96.4377 40.9371C96.2614 40.9239 96.1203 40.9088 96.0088 40.8935C95.9567 39.0573 95.8782 32.9919 97.4073 22.4743C98.766 13.1288 102.302 7.42438 104.883 4.66783ZM106.713 41.4403L107.002 42.3975C107.305 42.3062 107.546 42.0773 107.653 41.7802C109 38.0524 110.481 31.7376 110.886 24.6496C111.29 17.5654 110.626 9.61894 107.602 2.68255C107.147 1.63949 105.792 1.17814 104.812 1.98425C101.838 4.43294 97.0752 10.8574 95.4281 22.1866C93.7715 33.5811 93.975 39.865 94.0187 41.2138C94.0225 41.3324 94.0251 41.4128 94.0251 41.4552C94.025 42.261 94.695 42.5983 95.0067 42.7098C95.3591 42.8358 95.8079 42.8956 96.2886 42.9316C97.2769 43.0055 98.7924 43.0002 100.908 42.971C103.071 42.9411 104.566 42.806 105.534 42.6745C106.018 42.6088 106.371 42.5438 106.61 42.4932C106.729 42.4679 106.82 42.4461 106.885 42.4296C106.917 42.4214 106.943 42.4144 106.962 42.409L106.987 42.4021L106.996 42.3995L106.999 42.3984L107.001 42.398C107.001 42.398 107.002 42.3975 106.713 41.4403ZM106.426 40.4822L106.428 40.4817L106.43 40.4812C106.43 40.4812 106.429 40.4814 106.426 40.4822Z" fill="#69727D" />
			<path fillRule="evenodd" clipRule="evenodd" d="M104.22 13.8372C104.787 15.7536 104.996 18.3439 104.953 21.2589C104.907 24.4148 104.569 27.8559 104.134 31.0529C103.7 34.2469 103.172 37.1799 102.753 39.3152C102.544 40.3824 102.361 41.2491 102.232 41.8481C102.22 41.9009 102.209 41.9516 102.199 42.0001H100.503C100.526 38.5025 100.676 33.4168 101.183 28.2866C101.724 22.8227 102.66 17.4299 104.22 13.8372ZM103 43.0001C103.974 43.2266 103.974 43.2264 103.974 43.2262L103.978 43.2093L103.989 43.1613C103.999 43.1192 104.013 43.0571 104.031 42.976C104.067 42.814 104.12 42.5763 104.186 42.2713C104.318 41.6613 104.503 40.7819 104.716 39.7006C105.14 37.5391 105.675 34.5658 106.116 31.3223C106.556 28.0818 106.905 24.5541 106.953 21.2881C107 18.0456 106.753 14.9635 105.943 12.6671C105.815 12.3045 105.676 11.9539 105.512 11.6797C105.394 11.4809 105.045 10.9388 104.371 10.9076C103.702 10.8766 103.301 11.3772 103.156 11.5722C102.959 11.8385 102.774 12.1912 102.594 12.5778C100.767 16.4945 99.7565 22.3931 99.1929 28.0897C98.6258 33.8211 98.5 39.4812 98.5 43.0001V44.0001H103.794L103.974 43.2262L103 43.0001Z" fill="#69727D" />
			<path d="M79.2952 3.08259C73.4181 16.564 76.6423 34.1761 79.2676 41.4407C79.2676 41.4407 80.8299 41.9127 85.0867 41.9715C89.3434 42.0303 90.9554 41.9866 90.9554 41.4558C90.9553 40.9249 91.3533 34.6461 89.5628 22.3308C87.9462 11.2116 83.2888 5.02553 80.5325 2.75675C80.1157 2.4137 79.511 2.58777 79.2952 3.08259Z" fill="#E6E8EA" />
			<path fillRule="evenodd" clipRule="evenodd" d="M81.0978 4.66783C80.6337 4.17219 79.8403 4.35208 79.6005 4.9873C77.2644 11.1748 76.7267 18.1507 77.0914 24.5355C77.4671 31.1152 78.7963 36.9856 80.0267 40.5842C80.2028 40.6166 80.4308 40.6541 80.7155 40.6927C81.5929 40.8119 83.0069 40.9423 85.1005 40.9712C87.242 41.0008 88.6609 41.0031 89.5427 40.9371C89.7191 40.9239 89.8602 40.9088 89.9716 40.8935C90.0238 39.0573 90.1023 32.9919 88.5732 22.4743C87.2145 13.1288 83.6789 7.42438 81.0978 4.66783ZM79.2676 41.4403L78.9784 42.3975C78.676 42.3062 78.4345 42.0773 78.3271 41.7802C76.98 38.0524 75.4994 31.7376 75.0946 24.6496C74.69 17.5654 75.3547 9.61894 78.3786 2.68255C78.8333 1.63949 80.1887 1.17814 81.168 1.98425C84.1429 4.43294 88.9053 10.8574 90.5524 22.1866C92.209 33.5811 92.0055 39.865 91.9618 41.2138C91.958 41.3324 91.9554 41.4128 91.9554 41.4552C91.9554 42.261 91.2855 42.5983 90.9737 42.7098C90.6214 42.8358 90.1726 42.8956 89.6919 42.9316C88.7036 43.0055 87.1881 43.0002 85.0728 42.971C82.9096 42.9411 81.4141 42.806 80.4462 42.6745C79.9621 42.6088 79.6094 42.5438 79.3707 42.4932C79.2514 42.4679 79.1605 42.4461 79.0958 42.4296C79.0635 42.4214 79.0377 42.4144 79.0182 42.409L78.9937 42.4021L78.9849 42.3995L78.9814 42.3984L78.9798 42.398C78.9798 42.398 78.9784 42.3975 79.2676 41.4403ZM79.5541 40.4822L79.5526 40.4817L79.5507 40.4812C79.5507 40.4812 79.5514 40.4814 79.5541 40.4822Z" fill="#69727D" />
			<path fillRule="evenodd" clipRule="evenodd" d="M81.7604 13.8372C81.1939 15.7536 80.9847 18.3439 81.0272 21.2589C81.0733 24.4148 81.4118 27.8559 81.8464 31.0529C82.2805 34.2469 82.8081 37.1799 83.2274 39.3152C83.4369 40.3824 83.6192 41.2491 83.7488 41.8481C83.7603 41.9009 83.7713 41.9516 83.7819 42.0001H85.4771C85.4542 38.5025 85.3049 33.4168 84.7973 28.2866C84.2567 22.8227 83.32 17.4299 81.7604 13.8372ZM82.9805 43.0001C82.0065 43.2266 82.0064 43.2264 82.0064 43.2262L82.0025 43.2093L81.9914 43.1613C81.9818 43.1192 81.9677 43.0571 81.9494 42.976C81.913 42.814 81.8602 42.5763 81.7941 42.2713C81.6621 41.6613 81.4772 40.7819 81.2648 39.7006C80.8404 37.5391 80.3054 34.5658 79.8646 31.3223C79.4241 28.0818 79.0751 24.5541 79.0275 21.2881C78.9801 18.0456 79.227 14.9635 80.0375 12.6671C80.1655 12.3045 80.305 11.9539 80.4683 11.6797C80.5868 11.4809 80.9351 10.9388 81.6092 10.9076C82.2782 10.8766 82.6793 11.3772 82.8241 11.5722C83.0217 11.8385 83.2064 12.1912 83.3867 12.5778C85.2136 16.4945 86.224 22.3931 86.7876 28.0897C87.3546 33.8211 87.4805 39.4812 87.4805 43.0001V44.0001H82.1863L82.0064 43.2262L82.9805 43.0001Z" fill="#69727D" />
		</g>
		<defs>
			<clipPath id="clip0_3127_96542">
				<rect width="184" height="80" fill="white" />
			</clipPath>
		</defs>
	</SvgIcon>
);

const ImageToolsContainer = styled( Box )( ( { theme } ) => ( {
	height: `calc(100% - ${ theme.spacing( 8 ) })`,
} ) );

const ToolsTeaserContainer = styled( Box )( ( { theme } ) => ( {
	position: 'sticky',
	top: `calc(100% - ${ theme.spacing( 10 ) })`,
} ) );

const ImageTools = ( {
	setTool,
	generateNewPrompt,
	panelActive,
} ) => {
	const tools = [
		{
			label: __( 'Expand Image', 'elementor' ),
			Icon: ExpandIcon,
			onClick: () => setTool( PANELS.OUT_PAINTING ),
		},
		{
			label: __( 'Generative Fill', 'elementor' ),
			Icon: BrushIcon,
			onClick: () => setTool( PANELS.IN_PAINTING ),
		},
		{
			label: __( 'Resize', 'elementor' ),
			Icon: EnlargerIcon,
			onClick: () => setTool( PANELS.UPSCALE ),
		},
		{
			label: __( 'Variations', 'elementor' ),
			Icon: EvolveIcon,
			onClick: () => setTool( PANELS.IMAGE_TO_IMAGE ),
		},
	];
	return (
		<ImageToolsContainer>
			<Box sx={ { mb: 3 } }>
				<Button
					size="small"
					variant="text"
					color="secondary"
					startIcon={ <StyledChevronLeftIcon /> }
					onClick={ ( e ) => {
						e.preventDefault();
						generateNewPrompt();
					} }
				>
					{ __( 'Generate with a prompt', 'elementor' ) }
				</Button>
			</Box>
			<Typography variant="h3" sx={ { mb: 7 } }>
				{ __( 'Edit with AI', 'elementor' ) }
			</Typography>
			<Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={ 3 } justifyContent={ 'center' }>
				{ tools.map( ( { label, Icon, onClick } ) => (
					<Button
						onClick={ onClick }
						key={ label }
						variant="outlined"
						color="secondary"
						disabled={ ! panelActive }
						sx={ {
							py: 7,
							fontSize: '12px',
							height: 'auto',
							borderRadius: '4px',
						} }
					>
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							flexDirection="column"
						>
							<Icon sx={ { mb: 2 } } />
							{ label }
						</Box>
					</Button>
				) ) }
			</Box>

			<ToolsTeaserContainer display="flex" flexDirection="column" alignItems="center">
				<TeaserDrawing />

				<Typography variant="body2" align="center" color="secondary" sx={ { mt: 5 } }>
					{ __( 'Stay tuned! More incredible AI tools are coming your way soon.', 'elementor' ) }
				</Typography>
			</ToolsTeaserContainer>
		</ImageToolsContainer>
	);
};

ImageTools.propTypes = {
	setTool: PropTypes.func.isRequired,
	generateNewPrompt: PropTypes.func.isRequired,
	panelActive: PropTypes.bool.isRequired,
};

export default ImageTools;
