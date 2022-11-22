/* global $e */
import {useEffect, useRef, useState} from "react";

const Logo = () => {
	return (
		<div style={{
			width: '90px',
			margin: '0 auto',
		}}>
			<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1599.38 208.29"
				 fill="#ffffff">
				<path
					d="M1019.17,548l-31.7,7.55-22.1,5h-.2a76.27,76.27,0,0,1,1.86-18c1.84-7.42,5.85-16.08,12.81-19.88a29.52,29.52,0,0,1,24.86-1.42c8.31,3.3,12.12,11.31,13.76,19.63.45,2.31.76,4.65,1,7Zm57.6,12.57c0-57.62-36.3-82.4-82.68-82.4-52.43,0-85.28,36.3-85.28,82.69,0,50.41,28,83.26,88.16,83.26,32.55,0,51-5.77,72.89-16.71l-8.36-37.74c-16.71,7.48-32.27,12.09-53,12.09-22.76,0-35.72-8.64-40.62-24.77h107.46a79.89,79.89,0,0,0,1.44-16.42"
					transform="translate(-160.31 -435.85)"/>
				<path
					d="M537,548l-31.71,7.55-22.1,5H483a75.76,75.76,0,0,1,1.87-18c1.83-7.42,5.85-16.08,12.8-19.88a29.54,29.54,0,0,1,24.87-1.42c8.3,3.3,12.12,11.31,13.75,19.63a68.71,68.71,0,0,1,1,7Zm57.59,12.57c0-57.62-36.3-82.4-82.68-82.4-52.43,0-85.27,36.3-85.27,82.69,0,50.41,27.94,83.26,88.15,83.26,32.56,0,51-5.77,72.89-16.71L579.3,589.7c-16.71,7.48-32.27,12.09-53,12.09-22.76,0-35.73-8.64-40.62-24.77H593.12a79.89,79.89,0,0,0,1.44-16.42"
					transform="translate(-160.31 -435.85)"/>
				<rect x="190.52" width="53.21" height="202.53"/>
				<path
					d="M1088,483.39h55.89l11.76,35.8c7.36-17.66,23.93-40.41,53.3-40.41,40.33,0,62.22,20.45,62.22,73.18v86.42h-55.89q0-27,.06-54c0-8.25-.13-16.52,0-24.77.09-7.62.63-15.49-3.43-22.33-2.75-4.63-7.25-8-12.11-10.34a33.06,33.06,0,0,0-30.24.46c-2.38,1.24-13.88,7.47-13.88,10.35V638.38h-55.89V525.21Z"
					transform="translate(-160.31 -435.85)"/>
				<path
					d="M1313.46,524h-25.64V483.39h25.64V458l55.89-13.16v38.56h56.18V524h-56.18v45.52c0,17.86,8.64,26.22,21.61,26.22,13.25,0,20.74-1.73,32-5.48l6.62,42.06c-15.27,6.63-34.28,9.8-53.58,9.8-40.62,0-62.52-19.3-62.52-56.76Z"
					transform="translate(-160.31 -435.85)"/>
				<path
					d="M1530.1,598.05c20.45,0,32.55-14.69,32.55-38.32s-11.52-37.16-31.68-37.16c-20.46,0-32.27,13.54-32.27,38,0,23,11.52,37.45,31.4,37.45m.58-120.71c52.43,0,90.74,32.84,90.74,83.83,0,51.28-38.31,82.11-91.32,82.11-52.72,0-90.17-31.69-90.17-82.11,0-51,37.16-83.83,90.75-83.83"
					transform="translate(-160.31 -435.85)"/>
				<path
					d="M858.75,482.92A61.28,61.28,0,0,0,827,478.86a52.37,52.37,0,0,0-15.69,4.8c-13.54,6.69-24.11,21.94-29.77,35.54-3.72-15.66-14.56-29.75-30.41-36.28a61.28,61.28,0,0,0-31.76-4.06,52.2,52.2,0,0,0-15.69,4.8c-13.51,6.67-24,21.86-29.73,35.42v-1l-11.4-34.7H606.65l11.76,41.82V638.38h55.53V537.28c.2-.74,2.67-2.15,3.11-2.47,6.51-4.62,14.15-9.38,22.3-10,8.31-.62,16.49,3.6,21.44,10.2a23.88,23.88,0,0,1,1.49,2.22c4.06,6.84,3.52,14.71,3.43,22.33-.11,8.25,0,16.52,0,24.77q0,27-.06,54h55.89V552c0-.42,0-.86,0-1.29V537.32c.11-.73,2.67-2.19,3.13-2.51,6.51-4.62,14.15-9.38,22.29-10,8.31-.62,16.5,3.6,21.45,10.2a23.78,23.78,0,0,1,1.48,2.22c4.06,6.84,3.52,14.71,3.43,22.33-.1,8.25,0,16.52,0,24.77q0,27,0,54h55.89V552c0-25.35-3.64-58-30.46-69"
					transform="translate(-160.31 -435.85)"/>
				<path
					d="M1753.6,478.78c-29.37,0-45.93,22.75-53.3,40.41l-11.76-35.8h-55.89l11.76,41.82V638.38h55.89V533.8c8-1.41,51.2,6.56,59.39,9.55V479c-2-.11-4-.2-6.09-.2"
					transform="translate(-160.31 -435.85)"/>
				<path
					d="M270.67,548,239,555.58l-22.1,5h-.2a75.75,75.75,0,0,1,1.86-18c1.84-7.42,5.85-16.08,12.81-19.88a29.52,29.52,0,0,1,24.86-1.42c8.31,3.3,12.12,11.31,13.76,19.63.45,2.31.76,4.65,1,7Zm57.6,12.57c0-57.62-36.3-82.4-82.69-82.4-52.43,0-85.27,36.3-85.27,82.69,0,50.41,27.95,83.26,88.16,83.26,32.55,0,51-5.77,72.88-16.71L313,589.7c-16.71,7.48-32.27,12.09-53,12.09-22.76,0-35.72-8.64-40.62-24.77H326.83a80.61,80.61,0,0,0,1.44-16.42"
					transform="translate(-160.31 -435.85)"/>
			</svg>
		</div>
	);
}

function SwitchMode() {
	return (
		<div id="elementor-mode-switcher">
			<div id="elementor-mode-switcher-inner">
				<input id="elementor-mode-switcher-preview-input" type="checkbox"/>
				<label htmlFor="elementor-mode-switcher-preview-input" id="elementor-mode-switcher-preview"
					   title="Preview">
					<i className="eicon" aria-hidden="true" title="Hide Panel"></i>
					<span className="elementor-screen-only">Preview</span>
				</label>
			</div>
		</div>
	);
}

function Loading() {
	return (
		<div id="elementor-panel-state-loading">
			<i className="eicon-loading eicon-animation-spin"></i>
		</div>
	);
}

function Header(props) {
	return (
		<header id="elementor-panel-header-wrapper">
			<div id="elementor-panel-header">
				<div id="elementor-panel-header-menu-button" className="elementor-header-button"
					 onClick={() => props.setUseOldPanel(true) && $e.route('panel/menu')}>
					<i className="elementor-icon eicon-menu-bar tooltip-target" aria-hidden="true"
					   data-tooltip="Menu"></i>
					<span className="elementor-screen-only">Menu</span>
				</div>
				<div id="elementor-panel-header-title" className="elementor-beta-badge">
					<Logo/>
				</div>
				<div id="elementor-panel-header-add-button" className="elementor-header-button"
					 onClick={() => $e.route('panel/elements/categories')}>
					<i className="elementor-icon eicon-apps tooltip-target" aria-hidden="true"
					   data-tooltip="Widgets Panel"></i>
					<span className="elementor-screen-only">Widgets Panel</span>
				</div>
			</div>
		</header>
	);
}

function Main(props) {
	const ref = useRef();
	const scrollbar = useRef(false);

	useEffect(() => {
		if (!scrollbar.current) {
			// eslint-disable-next-line no-undef
			scrollbar.current = new PerfectScrollbar(ref.current, {
				suppressScrollX: true,
				// The RTL is buggy, so always keep it LTR.
				isRtl: false,
			});
			return;
		}

		scrollbar.current.update();
	}, [ref])

	return (
		<main id="elementor-panel-content-wrapper" ref={ref}>
			{props.children}
		</main>
	);
}

export const Panel = (props) => {
	const [useOldPanel, setUseOldPanel] = useState(false);

	return (
		<div id="e-panel" className="elementor-panel">
			{
				<div id="elementor-panel-inner" style={{
					display: useOldPanel ? 'none' : 'block',
				}}>
					<SwitchMode/>
					<Loading/>
					<Header setUseOldPanel={setUseOldPanel}/>
					<Main>
						{props.children}
					</Main>
				</div>
			}
			{
				<div id="elementor-panel" style={{
					display: useOldPanel ? 'block' : 'none',
					zIndex: 99,
					position: 'absolute',
					top: 0,
					left: 0,
					height: '100vh',
					width: '300px',
				}}></div>
			}
		</div>
	);
}
