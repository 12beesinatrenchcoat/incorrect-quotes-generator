// inputs.pronouns.js
// handling pronoun inputs, and other pronoun-related stuff.

/** @type {object} */
window.pronounTypes = {
	subjectPn: {
		name: "subject pronoun",
		defaults: {
			none: "they"
		},
		examples: [
			"This morning, {{input}} went to the park."
		]
	},
	objectPn: {
		name: "object pronoun",
		defaults: {
			none: "them"
		},
		examples: [
			"I went with {{input}}."
		]
	},
	possessiveDet: {
		name: "possessive determiner",
		defaults: {
			none: "their"
		},
		examples: [
			"{{name}} threw {{input}} frisbee."
		]
	},
	possessivePn: {
		name: "possessive pronoun",
		defaults: {
			none: "theirs",
			singular: "{{possessiveDet}}s",
			plural: "{{possessiveDet}}s"
		},
		examples: [
			"At least I think it was {{input}}."
		]
	},
	reflexivePn: {
		name: "reflexive pronoun",
		defaults: {
			none: "themself",
			singular: "{{objectPn}}self",
			plural: "{{objectPn}}selves"
		},
		examples: [
			"{{name}} can do it by {{input}}."
		]
	}
};

/** @type {Object[]} */
const pronounSets = [
	{subjectPn: "he", objectPn: "him", possessiveDet: "his", possessivePn: "his", reflexivePn: "himself"},
	{subjectPn: "she", objectPn: "her", possessiveDet: "her", possessivePn: "hers", reflexivePn: "herself"},
	{subjectPn: "it", objectPn: "it", possessiveDet: "its", possessivePn: "its", reflexivePn: "itself"}
];

window.createPronounsDiv = function (charNum) {
	// div containing all the pronouns-related stuff
	const pronounsDiv = document.createElement("div");
	pronounsDiv.className = "pronouns-block";

	// button to toggle display of pronouns.
	const pronounToggle = document.createElement("button");
	pronounsDiv.appendChild(pronounToggle);
	pronounToggle.textContent = "pronouns";
	pronounToggle.onclick = function () {
		const toggleDiv = this.parentNode.lastChild;
		if (toggleDiv.style.display === "none") {
			toggleDiv.style.display = "flex";
		} else {
			toggleDiv.style.display = "none";
		}
	};

	// a div containing the parts of the dropdown
	const pronounsInnerDiv = document.createElement("div");
	pronounsInnerDiv.className = "columns";
	pronounsInnerDiv.style.display = "none";
	pronounsDiv.appendChild(pronounsInnerDiv);

	// the pronoun inputs and their example sentences.
	const pronounSentences = document.createElement("div");
	pronounSentences.className = "pronouns";

	// for each pronounType... (see pronouns.js)
	Object.keys(window.pronounTypes).forEach(typeName => {
		const pronounType = window.pronounTypes[typeName];

		// creating the input element
		const pronounInput = document.createElement("input");
		pronounInput.classList.add("char-" + charNum, "pronoun", typeName);
		pronounInput.dataset.charNum = charNum;
		pronounInput.setAttribute("placeholder", pronounType.defaults.none);
		pronounInput.setAttribute("name", typeName);
		pronounInput.addEventListener("input", event => updatePronouns(event));
		pronounInput.addEventListener("input", event => window.updateFields(event));
		pronounInput.addEventListener("placeholder-change", event => window.updateFields(event));

		// get a random example sentence
		const {examples} = pronounType; // examples for the pronoun type
		let example = examples[Math.floor(Math.random() * examples.length)]; // get a random example from that

		// replace placeholder text in the examples
		const START_REPLACE = "{{";
		const END_REPLACE = "}}";

		let start = example.indexOf(START_REPLACE);
		let end = example.indexOf(END_REPLACE);

		let input = "";
		const output = [];

		while (start >= 0) {
			const substring = (example.substring(start + 2, end));

			switch (substring) {
				case "name":
					input = window.createField("name", charNum).outerHTML;
					break;

				case "input": {
					const split = example.split(START_REPLACE + substring + END_REPLACE);
					output[0] = split[0];
					example = split[1];
					break;
				}

				default:
					break;
			}

			example = example.replace(
				START_REPLACE + substring + END_REPLACE,
				input
			);

			start = example.indexOf(START_REPLACE);
			end = example.indexOf(END_REPLACE);
		}

		output[1] = example;

		// putting it all together with a nice label
		const label = document.createElement("label");
		label.insertAdjacentHTML("afterbegin", output[0]);
		label.insertAdjacentElement("beforeend", pronounInput);
		label.insertAdjacentHTML("beforeend", output[1]);

		pronounSentences.appendChild(label);
	});

	/* SETTINGS */
	const pronounSettings = document.createElement("div");
	pronounSettings.className = "pronounSettings";

	// treat pronoun as plural?
	const pluralLabel = document.createElement("label");
	const pluralInput = document.createElement("input");
	pluralInput.type = "checkbox";
	pluralInput.classList.add("char-" + charNum, "plural", "pronoun-setting");
	pluralInput.dataset.charNum = charNum;
	pluralInput.name = "plural";
	pluralInput.addEventListener("change", event => updatePronouns(event));
	pluralInput.addEventListener("change", event => window.updateFields(event));
	pluralLabel.appendChild(pluralInput);
	pluralLabel.insertAdjacentText("beforeend", "Treat as plural");

	pronounSettings.append(pluralLabel);

	pronounsInnerDiv.append(pronounSentences, pronounSettings);

	return pronounsDiv;
};

function updatePronouns(event) {
	// get the other pronoun inputs
	const charNum = event.target.classList[0].slice(5);
	const {pronouns: pronounInputs, settings: settingInputs} = window.charInputs[charNum];

	const settings = new Map();
	settingInputs.forEach(input => {
		settings.set(input.name, input.checked);
	});

	if (!pronounSets.some(pronounSet => {
		if (pronounInputs[0].value === pronounSet.subjectPn) {
			console.info("matched \"" + pronounInputs[0].value + "\" for character " + charNum + "! setting placeholder values for remaining inputs…");
			for (const input of pronounInputs) {
				input.placeholder = pronounSet[input.name];
				input.dispatchEvent(new Event("placeholder-change"));
			}

			return true;
		}

		return false;
	})) {
		// if it doesn't fit any of the pronoun sets
		pronounInputs.forEach(input => {
			if (settings.get("plural")) {
				input.placeholder =
					window.pronounTypes[input.name].defaults.plural ??
					window.pronounTypes[input.name].defaults.none;
			} else {
				input.placeholder =
					window.pronounTypes[input.name].defaults.singular ??
					window.pronounTypes[input.name].defaults.none;
			}

			let start = input.placeholder.indexOf("{{");
			let end = input.placeholder.indexOf("}}");

			while (start >= 0) {
				const substring = (input.placeholder.substring(start + 2, end));
				input.placeholder = input.placeholder.replace(
					"{{" + substring + "}}",
					window.getCharacterInput(charNum, substring)
				);

				start = input.placeholder.indexOf("{{");
				end = input.placeholder.indexOf("}}");
			}

			input.dispatchEvent(new Event("placeholder-change"));
		});
	}
}
