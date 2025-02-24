import { defineConfig } from "vite";

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
		settings.minify = "terser",
			settings.terserOptions = {
				ecma: 2015
			}
	}

	return settings;
});
