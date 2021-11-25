// prompts.loading.js
// deals with loading prompts.

const promptSetList = {}; // list of selectable promptSets.
window.fetchedPromptSets = {}; // list of fetched promptSets.
const prompts = {}; // object containing prompts from enabled promptSets. keys are number of characters.
window.filteredPrompts = {}; // duplicate of above, but filtered
const tags = {}; // tags, and whether or not they are enabled

// get the list of prompt sets.
fetch("./promptSetList.json")
	.then(response => response.json())
	.then(set => {
		Object.keys(set).forEach(key => {
			promptSetList[key] = set[key];
		});
	})
	.then(() => {
		Object.keys(promptSetList).forEach(key => {
			addPromptSetToSelector(key);
		});
		document.querySelector("#prompt-sets-loading").hidden = true;
	});

const promptSetSelector = document.querySelector("#prompt-set-selector");

// adding the prompt set to the selector, and fetching it.
function addPromptSetToSelector(key) {
	const set = promptSetList[key];
	const input = document.createElement("input");
	input.type = "checkbox";
	input.id = key;
	input.className = "prompt-set";

	input.addEventListener("input", async event => {
		const {target} = event;
		const key = target.id;

		if (target.checked) {
			if (window.fetchedPromptSets[key]) {
				console.log(`${promptSetList[key].title} already fetched...`);
			} else {
				target.indeterminate = true;
				await fetch(promptSetList[key].path)
					.then(response => response.json())
					.then(set => {
						Object.keys(set.prompts).forEach(charNum => {
							set.prompts[charNum].forEach(p => promptSetup(p, key));
						});
						window.fetchedPromptSets[key] = set;

						target.indeterminate = false;
						console.log(`fetched ${promptSetList[key].title}!`);
					});
			}

			Object.keys(window.fetchedPromptSets[key].prompts).forEach(charNum => {
				if (!prompts[charNum]) {
					prompts[charNum] = [];
				}

				prompts[charNum] = [...prompts[charNum],
					...window.fetchedPromptSets[key].prompts[charNum]];
			});
		} else {
			// delete prompts from set when unselected
			Object.keys(prompts).forEach(charNum => {
				prompts[charNum] = prompts[charNum].filter(p => p.set !== key);
			});
		}

		updateFilteredPrompts();
	});

	// the label...
	const label = document.createElement("label");
	label.appendChild(input);

	// title of the prompt set
	const title = document.createElement("strong");
	title.textContent = set.title;
	label.appendChild(title);

	label.append(" " + set.description + " ");

	const sourceLink = document.createElement("a");
	sourceLink.textContent = "Source";
	sourceLink.href = set.url;
	label.append(sourceLink);

	promptSetSelector.appendChild(label);
}

// to be run for every prompt
const promptSetup = (p, key) => {
	// giving each prompt a "set" key
	p.set = key;

	if (p.tags) {
		p.tags.forEach(tag => {
			if (!tags[tag]) {
				tags[tag] = {
					enabled: true
				};
				addTagToList(tag);
			}
		});
	}
};

// counting propts.
const promptCounter = document.querySelector("#prompt-count");
function updatePromptCounter() {
	let count = 0;
	runOnAllPrompts(window.filteredPrompts, () => {
		count++;
	});

	promptCounter.textContent = `${count > 0 ? count : "no"} prompt${count === 1 ? "" : "s"}`;
}

/**
 * Runs a function on every prompt.
 * @param {function} callbackFn
 */
function runOnAllPrompts(prompts, callbackFn) {
	Object.keys(prompts).forEach(charNum => {
		prompts[charNum].forEach(p => callbackFn(p));
	});
	return prompts;
}

/* FUNCTIONS INVOLVING TAGS AND STUFF */

// adding a tag to the page's tag list.
const tagList = document.querySelector("#tag-list");
function addTagToList(tagName) {
	if (Object.keys(tags).length > 0) {
		document.querySelector("#tag-list-empty").hidden = true;
	}

	const span = document.createElement("span");
	span.className = "tag";

	const input = document.createElement("input");
	input.type = "checkbox";
	input.id = tagName;
	input.checked = true;

	input.addEventListener("input", event => {
		const {target} = event;
		tags[target.id].enabled = target.checked;

		if (target.checked) {
			updateFilteredPrompts();
		} else {
			console.log(`filtered out ${filterPromptsByTag(target.id)} prompts with tag ${target.id}!`);
		}
	});

	span.appendChild(input);

	const label = document.createElement("label");
	label.htmlFor = tagName;
	label.append(tagName);

	span.appendChild(label);

	tagList.appendChild(span);
}

// filtering singular tags...
function filterPromptsByTag(tag) {
	let filteredCount = 0;
	Object.keys(window.filteredPrompts).forEach(charNum => {
		window.filteredPrompts[charNum] = window.filteredPrompts[charNum].filter(p => {
			if (p.tags && p.tags.includes(tag)) {
				filteredCount++;
				return false;
			}

			return true;
		});
	});
	updatePromptCounter();
	return filteredCount;
}

// filtering by all the tags / resetting window.filteredPrompts
function updateFilteredPrompts() {
	let totalFiltered = 0;
	const filteredTags = [];

	// reset...
	window.filteredPrompts = {...prompts};

	// filter out any disabled tags
	Object.keys(tags).forEach(tag => {
		if (!tags[tag].enabled) {
			filteredTags.push(tag);
			totalFiltered += filterPromptsByTag(tag);
		}
	});

	console.log(`reset window.filteredPrompts, and filtered ${filteredTags.length > 0 ? `${totalFiltered} prompts with tags [${filteredTags.join(", ")}]` : "nothing"}!`);
	updatePromptCounter();
}
