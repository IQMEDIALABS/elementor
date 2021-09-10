import { themeColors, tints, heading, lineHeight, fontWeight, spacing } from 'e-styles';

const spacingBase = spacing( 'base' );

export default {
	root: {
		shared: `
			color: var(--e-styles-heading-color, ${ tints( '800' ) });
			font-size: var(--e-styles-heading-font-size);
			margin-bottom: var(--e-styles-heading-margin-bottom);
		`,
		variants: {
			h1: `
				--e-styles-heading-color: ${ tints( '600' ) };
				--e-styles-heading-font-size: ${ heading( 'h1' ) };
				--e-styles-heading-margin-bottom: 2.5 * ${ spacingBase };
				font-weight: ${ fontWeight( 'medium' ) };
				line-height: ${ lineHeight( 'flat' ) };
			`,
			h2: `
				--e-styles-heading-color: ${ tints( '600' ) };
				--e-styles-heading-font-size: ${ heading( 'h2' ) };
				--e-styles-heading-margin-bottom: 2.5 * ${ spacingBase };
				font-weight: ${ fontWeight( 'medium' ) };
				line-height: ${ lineHeight( 'sm' ) };
				margin-top: 0;
			`,
			h3: `
				--e-styles-heading-font-size: ${ heading( 'h3' ) };
				--e-styles-heading-margin-bottom: ${ spacingBase };
				font-weight: ${ fontWeight( 'medium' ) };
				line-height: ${ lineHeight( 'sm' ) };
				margin-top: 0;
			`,
			h4: `
				--e-styles-heading-font-size: ${ heading( 'h4' ) };
				--e-styles-heading-margin-bottom: ${ spacingBase };
				margin-top: 0;
			`,
			h5: `
				--e-styles-heading-font-size: ${ heading( 'h5' ) };
				--e-styles-heading-margin-bottom: ${ spacingBase };
				margin-top: 0;
			`,
			h6: `
				--e-styles-heading-font-size: ${ heading( 'h6' ) };
				--e-styles-heading-margin-bottom: ${ spacingBase };
				font-weight: ${ fontWeight( 'bold' ) };
				margin-top: 0;
			`,
			display1: `
				--e-styles-heading-font-size: ${ heading( 'display1' ) };
				--e-styles-heading-margin-bottom: ${ spacingBase };
				margin-top: ${ spacingBase };
			`,
			display2: `
				--e-styles-heading-font-size: ${ heading( 'display1' ) };
				--e-styles-heading-margin-bottom: ${ spacingBase };
				margin-top: ${ spacingBase };
			`,
			display3: `
				--e-styles-heading-font-size: ${ heading( 'display3' ) };
				--e-styles-heading-margin-bottom: 2.5 * ${ spacingBase };
				margin-top: 0;
			`,
			display4: `
				--e-styles-heading-font-size: ${ heading( 'display4' ) };
				--e-styles-heading-margin-bottom: ${ spacingBase };
				margin-top: ${ spacingBase };
			`,
		},
	},
	light: {
		variants: {
			h1: `
				--color: ${ themeColors( 'primary' ) };
			`,
			h2: `
				border: 1px solid blue;
			`,
		},
	},
	dark: {
		variants: {
			h1: `
				--color: ${ themeColors( 'info' ) };
			`,
		},
	},
};
