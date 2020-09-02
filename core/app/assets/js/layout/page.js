import Header from './header';
import Sidebar from './sidebar';
import Content from './content';
import Footer from './footer';

const { useAppLayoutRefs } = window.elementorAppShared.context.appLayoutRefs;

export default function Page( props ) {
	const refs = useAppLayoutRefs();

	const AppSidebar = () => {
		if ( ! props.sidebar ) {
			return;
		}
		return (
			<Sidebar>
				{ props.sidebar }
			</Sidebar>
		);
	},
	AppFooter = () => {
		if ( ! props.footer ) {
			return;
		}
		return (
			<Footer>
				{props.footer}
			</Footer>
		);
	};

	return (
		<div className={`eps-app__lightbox ${ props.className }`}>
			<div className="eps-app" ref={ refs.pageRef }>
				<Header title={ props.title } buttons={ props.headerButtons } titleRedirectRoute={ props.titleRedirectRoute } />
				<div className="eps-app__main">
					{ AppSidebar() }
					<Content ref={ refs.contentRef }>
						{ props.content }
					</Content>
				</div>
				{ AppFooter() }
			</div>
		</div>
	);
}

Page.propTypes = {
	title: PropTypes.string,
	titleRedirectRoute: PropTypes.string,
	className: PropTypes.string,
	headerButtons: PropTypes.arrayOf( PropTypes.object ),
	sidebar: PropTypes.object,
	content: PropTypes.object.isRequired,
	footer: PropTypes.object,
};

Page.defaultProps = {
	className: '',
};
