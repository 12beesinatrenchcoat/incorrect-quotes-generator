// fields.js
// updating fields on input changes.

/** @type {HTMLSpanElement[]} */
window.fields = [[]];
// 0 is for fields in the output.

/**
 * Creates a new "field" that updates or whatever.
 * @param {string} property - What type of field (name, pronoun, etc).
 * @param {number} charNum - Character number.
 * @param {string} [content] - Content of field, if needed.
 * @returns HTMLSpanElement
 */
window.createField = function (property, charNum, content) {
	const field = document.createElement("span");
	field.classList.add("field", "char-" + charNum, property);
	field.title = property + " (character " + charNum + ")";

	if (!content) {
		content = window.getCharacterInput(charNum, property);
		if (!content) {
			switch (property) {
				case "name":
					content = "Character";
					break;

				default:
					content = window.pronounTypes[property].defaults.none;
					break;
			}
		}
	}

	field.textContent = content;

	return field;
};

window.updateFields = event => {
	const input = event.target;

	if (input.name === "name") {
		const fields = window.fields[input.dataset.charNum];

		fields.forEach(field => {
			field.innerText = input.value || input.placeholder;
		});
	}

	// updating output fields
	if (window.settings["update-output-fields"].checked) {
		const classList = ".char-" + input.dataset.charNum + "." + input.name;
		document.querySelectorAll("#output .field" + classList).forEach(field => {
			if (input.name === "plural") {
				const oldText = field.innerText;
				field.innerText = field.dataset.alt;
				field.dataset.alt = oldText;
			} else {
				field.innerText = input.value || input.placeholder;
			}
		});
	}
};
