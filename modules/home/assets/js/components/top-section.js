import { Box, Paper, Stack } from '@elementor/ui';
import Typography from '@elementor/ui/Typography';
import Button from '@elementor/ui/Button';
import YoutubeIcon from '../icons/youtube-icon';

const TopSection = ( { ...props } ) => {
	return (
		<Paper elevation={ 0 } sx={ { display: 'flex', flexDirection: { xs: 'column', md: 'row' }, p: { xs: 2, md: 4 }, gap: 3 } }>
			<Stack gap={ 3 }>
				<Box>
					<Typography variant="body2">{ __( `${ props.topData.title_small }`, 'elementor' ) }</Typography>
					<Typography variant="h6">{ __( `${ props.topData.title }`, 'elementor' ) }</Typography>
					<Typography variant="body2" >{ __( `${ props.topData.description }`, 'elementor' ) }</Typography>
				</Box>
				<Box sx={ { display: 'flex', gap: 1 } }>
					<Button variant="contained" size="small" href={ props.createNewPageUrl } target="_blank">{ __( `${ props.topData.button_create_page_title }`, 'elementor' ) }</Button>
					<Button variant="outlined" color="secondary" size="small" startIcon={ <YoutubeIcon /> } href={ props.topData.button_watch_url } target="_blank">{ __( `${ props.topData.button_watch_title }`, 'elementor' ) }</Button>
				</Box>
			</Stack>
			<Box component="iframe"
				src={ props.topData.youtube_embed_id }
				title="YouTube video player"
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowFullScreen={ true }
				sx={ { aspectRatio: '16/9', borderRadius: 1, display: 'flex', width: '100%', maxWidth: '365px' } }>
			</Box>
		</Paper>
	);
};

TopSection.propTypes = {
	topData: PropTypes.object.isRequired,
	createNewPageUrl: PropTypes.string.isRequired,
};

export default TopSection;
