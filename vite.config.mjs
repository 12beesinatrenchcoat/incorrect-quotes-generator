import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig(({ mode }) => {
	const settings = {
		css: {
			preprocessorOptions: {
				sass: {
					api: "modern-compiler"
				}
			}
		},
	};

	if (mode === "development") {
		settings.base = ""
	}

	if (mode === "production") {
		settings.base = "/incorrect-quotes-generator/";
		settings.plugins = [
			createHtmlPlugin({
				minify: true
			})
		]
		settings.minify = "terser",
			settings.terserOptions = {
				ecma: 2015
			}
	}

	return settings;
});
