import { ComponentPropsWithoutRef, ElementType } from 'react';
import { inject } from '@elementor/locations';
import {
	LOCATION_MAIN_MENU_DEFAULT,
	LOCATION_MAIN_MENU_EXITS,
	LOCATION_TOOLS_MENU_DEFAULT,
	LOCATION_UTILITIES_MENU_DEFAULT,
} from './consts';

const menuNameMap = {
	main: {
		default: LOCATION_MAIN_MENU_DEFAULT,
		exits: LOCATION_MAIN_MENU_EXITS,
	},
	tools: {
		default: LOCATION_TOOLS_MENU_DEFAULT,
	},
	utilities: {
		default: LOCATION_UTILITIES_MENU_DEFAULT,
	},
};

type MenuNameMap = Readonly<typeof menuNameMap>;
export type MenuName = keyof MenuNameMap;

type MenuItem<
	TMenuName extends MenuName,
	TComponent extends ElementType,
> = {
	name: string,
	group?: keyof MenuNameMap[ TMenuName ],
	priority?: number,
	overwrite?: boolean,
} & (
	{ props: ComponentPropsWithoutRef<TComponent>, useProps?: never } |
	{ useProps: () => ComponentPropsWithoutRef<TComponent>, props?: never }
)

export function createRegisterMenuItemFor<TComponent extends ElementType>( component: TComponent ) {
	return <TMenuName extends MenuName>(
		menuName: TMenuName,
		{ group = 'default', name, overwrite, priority, ...args }: MenuItem<TMenuName, TComponent>
	) => {
		const location = menuNameMap[ menuName ][ group ] as string;

		if ( ! location ) {
			return;
		}

		const useProps = 'props' in args ? () => args.props : args.useProps;

		const Component = component as ElementType;

		const Filler = () => {
			const componentProps = useProps();

			return <Component { ...componentProps } />;
		};

		inject( {
			location,
			name,
			filler: Filler,
			options: {
				priority,
				overwrite,
			},
		} );
	};
}
