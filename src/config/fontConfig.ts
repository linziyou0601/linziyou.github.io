// 字體配置
export const fontConfig = {
	enable: true,
	preload: true,
	selected: ["sweigothic-cjk"],

	fonts: {
		system: {
			id: "system",
			name: "系統字體",
			src: "",
			family:
				"system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
		},

		"sweigothic-cjk": {
			id: "sweigothic-cjk",
			name: "SweiGothic CJK TC",
			src: "https://cdn.jsdelivr.net/gh/niclin/sweiFont@main/SweiGothicCJKtc-Medium.css",
			family: "SweiGothicCJKtc-Medium",
			weight: 500,
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
		"SweiGothicCJKtc-Medium",
		"Roboto",
		"Helvetica",
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
