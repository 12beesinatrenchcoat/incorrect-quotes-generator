const {compile} = require("sass");
const {writeFile} = require("fs");

// compiling sass...
const sassOutput = compile("sass/style.sass", {
	sourceMap: false,
	style: "compressed"
});

sassOutput.css = "/* https://github.com/12beesinatrenchcoat/incorrect-quotes-generator/blob/master/style.sass */\n" +
	"/* also the external link icon is from font awesome (fa-solid fa-arrow-up-right-from-square from https://fontawesome.com). */\n" +
	sassOutput.css;

writeFile("style.css", sassOutput.css, err => {
	if (err) {
		console.log(err);
	}
});

// compiling js...
require('esbuild').build({
	entryPoints: ["js/fields.js", "js/inputs.js", "js/inputs.pronouns.js", "js/inputs.settings.js", "js/prompts.generator.js", "js/prompts.loading.js"],
	minify: true,
	target: "es6",
	outdir: 'dist'
}).catch(() => process.exit(1));

console.log("built files!");
