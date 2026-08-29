// Plan P6-T5: category + suffix-pattern filters alongside free-text
// search on the /components index, ported from the canonical
// SvelteKit reference
// (lily-design-system-svelte-sveltekit-examples/src/routes/components/+page.svelte
// and .../src/lib/data/suffix-pattern.ts).
//
// This app is a static site with progressive-enhancement JS (see
// AGENTS.md: "pages work without JS"). Unlike the other six ports,
// /components shipped with zero client-side search before this
// change -- a plain static <ul> of links. Rather than server-render a
// search box and two <select>s that would silently do nothing without
// this script, the filter panel itself is injected here, only once JS
// actually runs. Without JS the page is exactly the plain list Eleventy
// always rendered: every link still works, nothing is hidden, nothing
// looks interactive and isn't.
//
// The suffix-pattern derivation is a pure function of the slug string
// (no generated data file needed) and is kept in this one file --
// SUFFIX_PATTERNS mirrors the canonical list in
// AGENTS/components.md ("Suffix -> HTML element mapping" and
// "Component name patterns"), ordered longest-suffix-first so e.g.
// "table-head" matches before the bare "head" would, and "list-item"
// matches before "list". Exported alongside `init` so
// e2e/components-index.spec.ts can import the exact same function
// for its ground truth instead of duplicating the list a third time.

export const SUFFIX_PATTERNS = [
	{ id: "table-thead", label: "Gantt table head (-table-thead)" },
	{ id: "table-tbody", label: "Gantt table body (-table-tbody)" },
	{ id: "table-tfoot", label: "Gantt table foot (-table-tfoot)" },
	{ id: "table-tr", label: "Gantt table row (-table-tr)" },
	{ id: "table-th", label: "Table header cell (-table-th)" },
	{ id: "table-td", label: "Table data cell (-table-td)" },
	{ id: "table-head", label: "Table head (-table-head)" },
	{ id: "table-body", label: "Table body (-table-body)" },
	{ id: "table-foot", label: "Table foot (-table-foot)" },
	{ id: "table-row", label: "Table row (-table-row)" },
	{ id: "list-item", label: "List item (-list-item)" },
	{ id: "list", label: "List (-list)" },
	{ id: "picker-button", label: "Picker button (-picker-button)" },
	{ id: "bar-button", label: "Bar button (-bar-button)" },
	{ id: "bar", label: "Bar (-bar)" },
	{ id: "select-option", label: "Select option (-select-option)" },
	{ id: "option", label: "Option (-option)" },
	{ id: "group-item", label: "Group item (-group-item)" },
	{ id: "group", label: "Group (-group)" },
	{ id: "menu-item", label: "Menu item (-menu-item)" },
	{ id: "menu", label: "Menu (-menu)" },
	{ id: "picker", label: "Picker (-picker)" },
	{ id: "nav", label: "Nav (-nav)" },
	{ id: "input", label: "Input (-input)" },
	{ id: "view", label: "View (-view)" },
	{ id: "link", label: "Link (-link)" },
	{ id: "select", label: "Select (-select)" },
	{ id: "button", label: "Button (-button)" },
	{ id: "dialog", label: "Dialog (-dialog)" },
	{ id: "fieldset", label: "Fieldset (-fieldset)" },
	{ id: "figure", label: "Figure (-figure)" },
	{ id: "footer", label: "Footer (-footer)" },
	{ id: "header", label: "Header (-header)" },
	{ id: "aside", label: "Aside (-aside)" },
	{ id: "main", label: "Main (-main)" },
	{ id: "meter", label: "Meter (-meter)" },
	{ id: "progress", label: "Progress (-progress)" },
	{ id: "kbd", label: "Kbd (-kbd)" },
	{ id: "span", label: "Span (-span)" },
	{ id: "div", label: "Div (-div)" },
	{ id: "article", label: "Article (-article)" },
	{ id: "table", label: "Table (-table)" },
];

export const STANDALONE_ID = "standalone";
export const STANDALONE_LABEL = "Standalone (no suffix pattern)";

export function suffixPatternOf(slug) {
	for (const { id } of SUFFIX_PATTERNS) {
		if (slug === id || slug.endsWith(`-${id}`)) return id;
	}
	return STANDALONE_ID;
}

export const SUFFIX_LABEL = {
	...Object.fromEntries(SUFFIX_PATTERNS.map((p) => [p.id, p.label])),
	[STANDALONE_ID]: STANDALONE_LABEL,
};

function readCategoryLabels() {
	const el = document.getElementById("component-categories-data");
	if (!el) return {};
	try {
		return JSON.parse(el.textContent || "{}");
	} catch {
		return {};
	}
}

function countBy(records, key) {
	const counts = new Map();
	for (const record of records) {
		const id = record[key];
		counts.set(id, (counts.get(id) ?? 0) + 1);
	}
	return counts;
}

function slugFromHref(href) {
	return (href ?? "").replace(/^\/components\//, "").replace(/\/$/, "");
}

function buildSelectOptions(select, options, allLabel) {
	const allOption = document.createElement("option");
	allOption.value = "";
	allOption.textContent = allLabel;
	select.appendChild(allOption);
	for (const opt of options) {
		const option = document.createElement("option");
		option.value = opt.id;
		option.textContent = `${opt.label} (${opt.count})`;
		select.appendChild(option);
	}
}

export function init() {
	const container = document.querySelector('[data-module="components-search"]');
	if (!container) return;

	const list = container.querySelector("#component-index-list");
	if (!list) return;

	const items = Array.from(list.querySelectorAll(".component-index-list-item"));
	if (items.length === 0) return;

	const categoryLabels = readCategoryLabels();

	const records = items.map((li) => {
		const anchor = li.querySelector("a");
		const slug = slugFromHref(anchor ? anchor.getAttribute("href") : "");
		const suffix = suffixPatternOf(slug);
		li.dataset.suffix = suffix;
		return {
			li,
			slug,
			category: li.dataset.category || "",
			suffix,
			text: `${li.textContent || ""} ${slug}`.toLowerCase(),
		};
	});

	const total = records.length;

	const categoryCounts = countBy(records, "category");
	const categoryOptions = Object.entries(categoryLabels)
		.filter(([id]) => categoryCounts.has(id))
		.map(([id, label]) => ({ id, label, count: categoryCounts.get(id) }))
		.sort((a, b) => b.count - a.count);

	const suffixCounts = countBy(records, "suffix");
	const suffixOptions = Object.entries(SUFFIX_LABEL)
		.filter(([id]) => id !== STANDALONE_ID && suffixCounts.has(id))
		.map(([id, label]) => ({ id, label, count: suffixCounts.get(id) }))
		.sort((a, b) => b.count - a.count)
		.concat(
			suffixCounts.has(STANDALONE_ID)
				? [{ id: STANDALONE_ID, label: SUFFIX_LABEL[STANDALONE_ID], count: suffixCounts.get(STANDALONE_ID) }]
				: [],
		);

	// Build the filter panel and insert it in place of the static count
	// paragraph -- this is the moment the page moves from "plain list"
	// to "filterable list", and it only happens because this script ran.
	const countPara = container.querySelector("#components-count");

	const panel = document.createElement("div");
	panel.id = "components-search-panel";
	panel.innerHTML = `
		<div class="field">
			<label class="label" for="component-search-input">Filter components</label>
			<input id="component-search-input" type="search" class="search-input" placeholder="Search components...">
		</div>
		<div class="field">
			<label class="label" for="component-category-filter">Category</label>
			<select id="component-category-filter" class="select"></select>
		</div>
		<div class="field">
			<label class="label" for="component-suffix-filter">Suffix pattern</label>
			<select id="component-suffix-filter" class="select"></select>
		</div>
		<p><button type="button" class="button" id="component-filters-clear">Clear filters</button></p>
		<p role="status" id="component-filters-status"></p>
	`;

	if (countPara) {
		countPara.hidden = true;
		countPara.insertAdjacentElement("afterend", panel);
	} else {
		list.insertAdjacentElement("beforebegin", panel);
	}

	const searchInput = panel.querySelector("#component-search-input");
	const categorySelect = panel.querySelector("#component-category-filter");
	const suffixSelect = panel.querySelector("#component-suffix-filter");
	const clearButton = panel.querySelector("#component-filters-clear");
	const status = panel.querySelector("#component-filters-status");

	buildSelectOptions(categorySelect, categoryOptions, `All categories (${total})`);
	buildSelectOptions(suffixSelect, suffixOptions, `All suffix patterns (${total})`);

	function applyFilters() {
		const query = searchInput.value.trim().toLowerCase();
		const categoryValue = categorySelect.value;
		const suffixValue = suffixSelect.value;

		let shown = 0;
		for (const record of records) {
			const matchesSearch = query === "" || record.text.includes(query);
			const matchesCategory = categoryValue === "" || record.category === categoryValue;
			const matchesSuffix = suffixValue === "" || record.suffix === suffixValue;
			const visible = matchesSearch && matchesCategory && matchesSuffix;
			record.li.hidden = !visible;
			if (visible) shown += 1;
		}

		status.textContent = `${shown} of ${total} components`;
	}

	searchInput.addEventListener("input", applyFilters);
	categorySelect.addEventListener("change", applyFilters);
	suffixSelect.addEventListener("change", applyFilters);
	clearButton.addEventListener("click", () => {
		searchInput.value = "";
		categorySelect.value = "";
		suffixSelect.value = "";
		applyFilters();
	});

	applyFilters();
}
