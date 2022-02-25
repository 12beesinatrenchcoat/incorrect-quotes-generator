# incorrect-quotes-generator

![GitHub last commit](https://img.shields.io/github/last-commit/12beesinatrenchcoat/incorrect-quotes-generator?style=flat-square)
![XO code style](https://flat.badgen.net/badge/code%20style/XO%28-ish%29/cyan)
![Badge count](https://img.shields.io/badge/badges-half%20life%203%20confirmed-informational?style=flat-square)

**A little overcomplicated web thing that inserts character names into prompts to make "incorrect quotes". Because comedy.**

 ~~Rips off~~ heavily inspired by [Scatterpatter's Incorrect Quotes Generator](https://incorrect-quotes-generator.neocities.org/) — in fact, all of the prompts are stolen from his generator.

Colors are from / based on Holllo's color theme, [Love](https://love.holllo.cc/). (It's quite pretty!) Love is under the [MIT License](https://git.holllo.cc/Holllo/love/src/branch/main/LICENSE).

The external link icon ("arrow-up-right-from-square") is from [Font Awesome 6.0](https://fontawesome.com/v6.0/icons/arrow-up-right-from-square?s=solid). Its SVG code is in [style.sass](sass/style.sass).

## prompts
The [rawPromptSets](./rawPromptSets) directory contains the sets of prompts, each of which are formatted like:
```jsonc
{
	"title": "a title for this fine collection of prompts",
	"description": "an equally fine description",
	"url": "creator's url or something. attribution.",
	// object containing arrays
	"prompts": {
		"1": [ // prompts grouped by how many characters are in them
			{ // text: String; tags: [String]
				"text": "{1}: boy do i like beans!",
				"tags": ["shipping", "swearing"] // optional.
			}
		]
	}
}
```

There's also [promptSetList.json](./promptSetList.json), containing all the loadable prompt sets.

If you want to load your own prompt sets, use the `window.fetchPromptSet(path, key)` function (where "path" is a path to the json file, and "key" is what the set will be internally referred to)! \
Feel free to submit pull requests.

## contributing
[Issues](https://github.com/12beesinatrenchcoat/incorrect-quotes-generator/issues/new) and pull requests welcome (please create an issue if you plan on working on anything major though, thanks!)
