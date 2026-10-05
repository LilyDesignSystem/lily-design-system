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
    for (const option of Array.from(select.options)) option.selected = values.includes(option.value);
}
