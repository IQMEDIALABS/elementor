import { SvgIcon } from '@elementor/ui';

const DownloadIcon = React.forwardRef( ( props, ref ) => {
	return (
		<SvgIcon viewBox="0 0 24 24" { ...props } ref={ ref }>
			<path fillRule="evenodd" clipRule="evenodd" d="M4 16.25C4.41421 16.25 4.75 16.5858 4.75 17V19C4.75 19.3315 4.8817 19.6495 5.11612 19.8839C5.35054 20.1183 5.66848 20.25 6 20.25H18C18.3315 20.25 18.6495 20.1183 18.8839 19.8839C19.1183 19.6495 19.25 19.3315 19.25 19V17C19.25 16.5858 19.5858 16.25 20 16.25C20.4142 16.25 20.75 16.5858 20.75 17V19C20.75 19.7293 20.4603 20.4288 19.9445 20.9445C19.4288 21.4603 18.7293 21.75 18 21.75H6C5.27065 21.75 4.57118 21.4603 4.05546 20.9445C3.53973 20.4288 3.25 19.7293 3.25 19V17C3.25 16.5858 3.58579 16.25 4 16.25Z" />
			<path fillRule="evenodd" clipRule="evenodd" d="M6.46967 10.4697C6.76256 10.1768 7.23744 10.1768 7.53033 10.4697L12 14.9393L16.4697 10.4697C16.7626 10.1768 17.2374 10.1768 17.5303 10.4697C17.8232 10.7626 17.8232 11.2374 17.5303 11.5303L12.5303 16.5303C12.2374 16.8232 11.7626 16.8232 11.4697 16.5303L6.46967 11.5303C6.17678 11.2374 6.17678 10.7626 6.46967 10.4697Z" />
			<path fillRule="evenodd" clipRule="evenodd" d="M12 3.25C12.4142 3.25 12.75 3.58579 12.75 4V16C12.75 16.4142 12.4142 16.75 12 16.75C11.5858 16.75 11.25 16.4142 11.25 16V4C11.25 3.58579 11.5858 3.25 12 3.25Z" />
		</SvgIcon>
	);
} );

export default DownloadIcon;
