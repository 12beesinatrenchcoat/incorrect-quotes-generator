// prompts.generator.js
// generating the prompt/quote/whatever term i use anymore.

window.generateQuote = function () {
	console.group("creating a new quote...");
	console.time("generateQuote");

	// get characters from <input>s, add to array
	const characters = window.getCharacters();

	// randomize character order?
	if (window.settings.randomize.checked) {
		// fisher-yates shuffle - thanks https://javascript.info/task/shuffle
		for (let i = characters.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[characters[i], characters[j]] = [characters[j], characters[i]];
		}
	}

	const minCharsInput = window.settings["prompt-characters-min"];
	const maxCharsInput = window.settings["prompt-characters-max"];

	const minChars = minCharsInput.value || minCharsInput.placeholder;
	const maxChars = maxCharsInput.value || maxCharsInput.placeholder;

	// how many characters to use in the prompt?
	const charsInPrompt = window.settings["character-range-toggle"].checked ?
		randomPromptSetNumberFromRange(minChars, maxChars) : // range enabled
		minChars; // range disabled

	console.debug(`using ${charsInPrompt} characters...`);

	const workingArray = window.filteredPrompts[charsInPrompt];

	// getting a random prompt
	const prompt = workingArray[Math.floor(Math.random() * workingArray.length)];

	let output = prompt.text; // declare output...

	console.debug("prompt:", prompt);

	console.groupCollapsed("text replacement");
	console.time("generateQuote > text replacement");

	const START_REPLACE = "{{";
	const END_REPLACE = "}}";

	let start = output.indexOf(START_REPLACE);
	let end = output.indexOf(END_REPLACE);

	// replacing the text as long as there's "{{"
	while (start >= 0) {
		let replaceValue; // thing to replace text with

		const substring = (output.substring(start + 2, end));
		/*
		format of these things (substrings):
			{{charNum.value % modifiers}}
		and if comparing boolean...
			{{charNum.boolean ? true : false % modifiers}}
		modifiers are separated by spaces.
		*/

		// parse the substring...
		let [charObject, modifiers] = substring.split("%", 2); // split values + modifiers

		charObject = charObject.split("?", 2);
		charObject[0] = charObject[0].split("."); // [charNum, value]

		// charNum.value
		const character = characters[charObject[0].shift() - 1]; // returns character object, see window.getCharacters()

		let property = charObject[0].shift().trim();
		replaceValue = character[property];

		// character.object.value
		while (typeof (replaceValue) === "object") {
			property = charObject[0].shift().trim();
			replaceValue = replaceValue[property];
		}

		let altValue = "";
		if (typeof (replaceValue) === "boolean") {
			console.debug(replaceValue);
			const a = charObject[1].split(":");
			replaceValue = replaceValue ? a[0] : a[1];

			altValue = charObject[0] ? a[1] : a[0];
			altValue = altValue.trim();
			altValue = applyModifiers(altValue, modifiers);
		}

		replaceValue = replaceValue.trim();
		replaceValue = applyModifiers(replaceValue, modifiers);

		console.debug("replacing \"" + substring + "\" with \"" + replaceValue + "\"");

		const field = window.createField(property, character.charNum, replaceValue);

		if (altValue) {
			field.dataset.alt = altValue;
		}

		// do the replacement
		output = output.replace(
			START_REPLACE + substring + END_REPLACE,
			field.outerHTML
		);

		// get new indices and repeat if {{ and }} still exist
		start = output.indexOf(START_REPLACE);
		end = output.indexOf(END_REPLACE);
	}

	console.timeEnd("generateQuote > text replacement");
	console.groupEnd(); // text replacement done

	document.querySelector("#output").innerHTML = output;
	window.fields[0] = document.querySelectorAll("#output .field");

	const about = document.querySelector("#output-about");
	about.innerText = "from ";
	const em = document.createElement("em");
	em.innerText = window.fetchedPromptSets[prompt.set].title;
	about.appendChild(em);

	console.timeEnd("generateQuote");
	console.groupEnd();
};

// returns a random set of prompts, weighted by amount of contents
const randomPromptSetNumberFromRange = function (min, max) {
	min = Number(min);
	max = Number(max);

	const weight = {};
	let total = 0;

	for (let i = min; i < (max + 1); i++) {
		const setLength = window.filteredPrompts[i].length;
		total += setLength;
		weight[i] = setLength;
	}

	const keys = Object.keys(weight);

	keys.forEach(key => {
		weight[key] /= total;
	});

	const r = Math.random();
	let sum = 0;
	let output;

	keys.some(key => {
		sum += weight[key];
		if (r <= sum) {
			output = key;
			return true;
		}

		return false;
	});

	return output;
};

const applyModifiers = function (text = "", modifiers = "") {
	if (modifiers) {
		modifiers = modifiers.split(" "); // % modifiers
		modifiers.forEach(modifier => {
			switch (modifier) {
				case "upper": // uppercase
					text = text.toUpperCase();
					break;

				case "first": // first character
					text = text[0];
					break;

				default:
					break;
			}
		});
	}

	return text;
};
