// Shared helpers for components whose attribute value is a list of strings
// (MultiSelect, MultiSelectWithExtras, KbdShortcut).

/** Parse the `value` attribute: JSON array, else comma-separated. */
export function parseValues(raw: string | null): string[] {
    if (raw === null || raw.trim() === "") return [];
    if (raw.trim().startsWith("[")) {
        try {
            const parsed: unknown = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed.map(String);
        } catch {
            /* fall through to comma-separated */
        }
    }
    return raw.split(",").map((s) => s.trim());
}

export function selectValues(select: HTMLSelectElement, values: string[]): void {
    for (const option of Array.from(select.options))
        option.selected = values.includes(option.value);
}

/**
 * Make values the select's default choice (tasks.md P50-T28), as a form reset restores it. Like a native option's selected
 * attribute, it changes what is chosen only for the options the person has not changed.
 */
export function defaultValues(select: HTMLSelectElement, values: string[]): void {
    for (const option of Array.from(select.options))
        option.defaultSelected = values.includes(option.value);
}

/** Bring a built select in step with its host's label, size, required and disabled (tasks.md P50-T28). */
export function followSelect(host: HTMLElement, select: HTMLSelectElement): void {
    const label = host.getAttribute("label");
    if (label !== null) select.setAttribute("aria-label", label);
    else select.removeAttribute("aria-label");
    const size = host.getAttribute("size");
    if (size !== null) select.setAttribute("size", size);
    else select.removeAttribute("size");
    select.required = host.hasAttribute("required");
    select.disabled = host.hasAttribute("disabled");
}
