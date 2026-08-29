// Plan P6-T5: the /components search's suffix-pattern filter.
//
// A slug's suffix pattern is derived purely from the slug string —
// no generated data file needed. The list below mirrors two canonical
// sources verbatim: the "Suffix → HTML element mapping" table and the
// "Component name patterns" compound families, both in
// AGENTS/components.md. It is ordered longest-suffix-first so e.g.
// "table-head" matches before the bare "head" would (which isn't even
// a listed suffix), and "list-item" matches before "list".
//
// Most of the catalog has NO shared suffix family — Alert, Badge,
// Hero, and 170+ other leaf components are simply named for what they
// are. That's the documented shape of the catalog, not a gap in this
// list, so unmatched slugs fall into an honest "standalone" bucket
// rather than a fabricated one.

export interface SuffixPattern {
	id: string;
	label: string;
}

export const SUFFIX_PATTERNS: SuffixPattern[] = [
	{ id: 'table-thead', label: 'Gantt table head (-table-thead)' },
	{ id: 'table-tbody', label: 'Gantt table body (-table-tbody)' },
	{ id: 'table-tfoot', label: 'Gantt table foot (-table-tfoot)' },
	{ id: 'table-tr', label: 'Gantt table row (-table-tr)' },
	{ id: 'table-th', label: 'Table header cell (-table-th)' },
	{ id: 'table-td', label: 'Table data cell (-table-td)' },
	{ id: 'table-head', label: 'Table head (-table-head)' },
	{ id: 'table-body', label: 'Table body (-table-body)' },
	{ id: 'table-foot', label: 'Table foot (-table-foot)' },
	{ id: 'table-row', label: 'Table row (-table-row)' },
	{ id: 'list-item', label: 'List item (-list-item)' },
	{ id: 'list', label: 'List (-list)' },
	{ id: 'picker-button', label: 'Picker button (-picker-button)' },
	{ id: 'bar-button', label: 'Bar button (-bar-button)' },
	{ id: 'bar', label: 'Bar (-bar)' },
	{ id: 'select-option', label: 'Select option (-select-option)' },
	{ id: 'option', label: 'Option (-option)' },
	{ id: 'group-item', label: 'Group item (-group-item)' },
	{ id: 'group', label: 'Group (-group)' },
	{ id: 'menu-item', label: 'Menu item (-menu-item)' },
	{ id: 'menu', label: 'Menu (-menu)' },
	{ id: 'picker', label: 'Picker (-picker)' },
	{ id: 'nav', label: 'Nav (-nav)' },
	{ id: 'input', label: 'Input (-input)' },
	{ id: 'view', label: 'View (-view)' },
	{ id: 'link', label: 'Link (-link)' },
	{ id: 'select', label: 'Select (-select)' },
	{ id: 'button', label: 'Button (-button)' },
	{ id: 'dialog', label: 'Dialog (-dialog)' },
	{ id: 'fieldset', label: 'Fieldset (-fieldset)' },
	{ id: 'figure', label: 'Figure (-figure)' },
	{ id: 'footer', label: 'Footer (-footer)' },
	{ id: 'header', label: 'Header (-header)' },
	{ id: 'aside', label: 'Aside (-aside)' },
	{ id: 'main', label: 'Main (-main)' },
	{ id: 'meter', label: 'Meter (-meter)' },
	{ id: 'progress', label: 'Progress (-progress)' },
	{ id: 'kbd', label: 'Kbd (-kbd)' },
	{ id: 'span', label: 'Span (-span)' },
	{ id: 'div', label: 'Div (-div)' },
	{ id: 'article', label: 'Article (-article)' },
	{ id: 'table', label: 'Table (-table)' }
];

export const STANDALONE_ID = 'standalone';
export const STANDALONE_LABEL = 'Standalone (no suffix pattern)';

export function suffixPatternOf(slug: string): string {
	for (const { id } of SUFFIX_PATTERNS) {
		if (slug === id || slug.endsWith(`-${id}`)) return id;
	}
	return STANDALONE_ID;
}

export const SUFFIX_LABEL: Record<string, string> = {
	...Object.fromEntries(SUFFIX_PATTERNS.map((p) => [p.id, p.label])),
	[STANDALONE_ID]: STANDALONE_LABEL
};
