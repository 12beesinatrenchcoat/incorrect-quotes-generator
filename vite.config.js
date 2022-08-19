import {defineConfig} from "vite";
import {createHtmlPlugin} from "vite-plugin-html";

export default defineConfig(({mode}) => {
	if (mode === "development") {
		return {
			base: ""
		};
	}

	return {
		plugins: [
			createHtmlPlugin({
				minify: true
			})
		],
		base: "/incorrect-quotes-generator/",
		minify: "terser",
		terserOptions: {
			ecma: 2015
		}
	};
});
