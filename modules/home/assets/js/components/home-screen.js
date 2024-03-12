import { Container } from '@elementor/ui';

import TopSection from './top-section';

const HomeScreen = () => {
	const videoUrl = 'https://elementor.com/academy/getting-started-with-elementor/',
		ctaUrl = elementorAppConfig.pages_url,
		embedUrl = 'https://www.youtube.com/embed/icTcREd1tAg?si=40E8D1hdnu26-TXM';

	return (
		<Container sx={ { display: 'flex', flexDirection: 'column', gap: { xs: 1, md: 3 }, py: { xs: 2, md: 6 }, maxWidth: { md: '990px' } } }>
			<TopSection videoUrl={ videoUrl } ctaUrl={ ctaUrl } embedUrl={ embedUrl } />
		</Container>
	);
};

export default HomeScreen;
