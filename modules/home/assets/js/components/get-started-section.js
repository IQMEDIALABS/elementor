import { Box, Paper, Typography } from '@elementor/ui';
import List from '@elementor/ui/List';
import ListItemText from '@elementor/ui/ListItemText';
import ListItemButton from '@elementor/ui/ListItemButton';

const GetStarted = ( { ...props } ) => {
	// Will be replaced with a backend solution
	const adminUrl = elementorAppConfig.admin_url;
	return (
		<Paper elevation={ 0 } sx={ { p: 3, display: 'flex', flexDirection: 'column', gap: 2 } }>
			<Typography variant="h6">{ props.getStartedData.header.title }</Typography>
			<List sx={ { display: 'grid', gridTemplateColumns: { md: 'repeat(4, 1fr)', xs: 'repeat(2, 1fr)' }, gap: { md: 9, xs: 7 } } }>
				{
					props.getStartedData.repeater.map( ( item ) => {
						return (
							<ListItemButton key={ item.title } alignItems="flex-start" href={ `${ adminUrl }${ item.file_path }` } target="_blank" sx={ { gap: 1, p: 0, '&:hover': { backgroundColor: 'initial' }, maxWidth: '150px' } }>
								<Box component="img" src={ props.getStartedData.header.image }></Box>
								<Box>
									<ListItemText primary={ item.title } primaryTypographyProps={ { variant: 'subtitle1' } } sx={ { my: 0 } } />
									<ListItemText primary={ item.title_small } primaryTypographyProps={ { variant: 'body2', color: 'text.tertiary' } } sx={ { '&:hover': { borderBottom: 1, borderColor: 'text.tertiary', maxWidth: 'fit-content' } } } />
								</Box>
							</ListItemButton>
						);
					} )
				}
			</List>
		</Paper>
	);
};

export default GetStarted;

GetStarted.propTypes = {
	getStartedData: PropTypes.object.isRequired,
};
