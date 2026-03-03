// 字體配置
export const fontConfig = {
	enable: true,
	preload: true,
	selected: ["huninn", "iansui", "allura"],

	fonts: {
		system: {
			id: "system",
			name: "系統字體",
			src: "",
			family:
				"system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
		},

		// justfont x Google Fonts 粉圓
		huninn: {
			id: "huninn",
			name: "Huninn",
			src: "https://fonts.googleapis.com/css2?family=Huninn&display=swap",
			family: "Huninn",
			display: "swap" as const,
		},

		// justfont x Google Fonts 芫荽
		iansui: {
			id: "iansui",
			name: "Iansui",
			src: "https://fonts.googleapis.com/css2?family=Iansui&display=swap",
			family: "Iansui",
			display: "swap" as const,
		},

		allura: {
			id: "allura",
			name: "Allura",
			src: "https://fonts.googleapis.com/css2?family=Allura&display=swap",
			family: "Allura",
			display: "swap" as const,
		},
	},

	fallback: [
		"PingFang TC",
		"微軟正黑體",
		"Microsoft JhengHei",
		"system-ui",
		"-apple-system",
		"BlinkMacSystemFont",
		"Segoe UI",
		"sans-serif",
	],
};
