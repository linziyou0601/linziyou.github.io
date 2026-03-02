import {
	LinkPreset,
	type NavBarConfig,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/config";

export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "作品",
			url: "/works/",
		},
		LinkPreset.About,
	],
};
