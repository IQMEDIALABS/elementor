export default function SelectPreset( props ) {
	const containerHelper = $e.components.get( 'editor' ).defaultUtils().container,
		onPresetSelected = ( preset, container ) => {
			const options = {
				createWrapper: false,
			};

			// Create new one by selected preset.
			containerHelper.createContainerFromPreset( preset, container, options );
		};

	return (
		<>
			<div className="elementor-add-section-close">
				<i onClick={() => props.setIsRenderPresets( false )} className="eicon-close" aria-hidden="true"/>
				<span className="elementor-screen-only">{__( 'Close', 'elementor' )}</span>
			</div>
			<div className="e-view e-container-select-preset">
				<div
					className="e-container-select-preset__title">{__( 'Select your Structure', 'elementor' )}</div>
				<div className="e-container-select-preset__list">
					{
						elementor.presetsFactory.getContainerPresets().map( ( preset ) => (
							<div onClick={() => onPresetSelected( preset, props.container )}
								key={preset} className="e-container-preset" data-preset={preset}
								dangerouslySetInnerHTML={{ __html: elementor.presetsFactory.getContainerPreset( preset ) }}/>
						) )
					}
				</div>
			</div>
		</>
	);
}

SelectPreset.propTypes = {
	container: PropTypes.object.isRequired,
	setIsRenderPresets: PropTypes.func.isRequired,
};
