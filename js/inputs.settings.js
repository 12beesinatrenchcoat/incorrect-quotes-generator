// inputs.settings.js
// stuff dealing with settings.

// contains input element objects.
window.settings = {};
document.querySelectorAll("#settings input").forEach(input => {
	// turns out getElementById is dynamic. neato.
	window.settings[input.id] = document.getElementById(input.id);
});

console.debug(window.settings);

// updating maximum characters in prompt input when minimum is updated
document.querySelector("#prompt-characters-min").addEventListener("input", event => {
	if (isNaN(event.target.valueAsNumber)) {
		// things get messy if the value isn't a number...
		return;
	}

	const {target} = event;

	const eventValue = clamp(target.valueAsNumber, target.min, target.max);

	if (window.settings["character-range-toggle"].checked) {
		const maxInput = document.querySelector("#prompt-characters-max");
		maxInput.min = eventValue + 1;
		if (maxInput.value) {
			maxInput.value = clamp(maxInput.valueAsNumber, maxInput.min, maxInput.max);
		}
	}
});

document.querySelectorAll("#settings input[type=number]").forEach(input => {
	input.addEventListener("input", event => {
		const {target} = event;

		// input validation, must not be less than minimum / greater than maximum
		target.value = clamp(target.value, target.min, target.max);

		// plural or singular "character"
		if (target.value === "1") {
			target.nextSibling.nodeValue = " character";
		} else {
			target.nextSibling.nodeValue = " characters";
		}
	});
});

// updating character ranges when characters are added or removed
window.updateCharacterRange = function (charCount) {
	const minInput = document.querySelector("#prompt-characters-min");
	const maxInput = document.querySelector("#prompt-characters-max");
	const charRangeToggle = window.settings["character-range-toggle"].checked;

	if (charRangeToggle) {
		minInput.max = charCount - 1;
		minInput.placeholder = 1;
	} else {
		minInput.max = charCount || 1;
		minInput.placeholder = charCount;
	}

	if (!minInput.value && minInput.placeholder > 1) {
		minInput.nextSibling.nodeValue = " characters";
	} else {
		minInput.nextSibling.nodeValue = " character";
	}

	maxInput.max = charCount;
	maxInput.placeholder = charCount;

	const toggle = document.querySelector("#character-range-toggle");
	toggle.disabled = charCount === 1;
	if (charCount === 1 && toggle.checked) {
		toggle.checked = false;
		maxInput.parentElement.hidden = true;
		console.debug("updated setting character-range-toggle to value false", "(too few characters!)");
	}
};

// when the character range toggle is checked or unchecked.
document.querySelector("#character-range-toggle").addEventListener("input", event => {
	const charRangeInputs = document.querySelectorAll("#settings input[type=number]");
	const charCount = window.getCharacters().length;
	if (event.target.checked) {
		charRangeInputs[0].previousSibling.nodeValue = "Use prompts with at least ";
		charRangeInputs[1].parentElement.hidden = false;
		// gotta set new limits too...
		charRangeInputs[0].placeholder = 1;
		charRangeInputs[0].max = charCount - 1;
		charRangeInputs[1].max = charCount;
	} else {
		charRangeInputs[0].previousSibling.nodeValue = "Use prompts with ";
		charRangeInputs[1].parentElement.hidden = true;
		charRangeInputs[0].placeholder = charCount;
		charRangeInputs[0].max = charCount;
	}
});

// some helping functions

/**
 * Returns a number, limited to a specific range. Thanks Otto https://stackoverflow.com/a/11409944/10873246
 * @param {number} num A value that should be between the ranges.
 * @param {number} min Lowest returnable value
 * @param {number} max Highest returnable value
 * @returns {number}
 */
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
