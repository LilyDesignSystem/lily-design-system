/**
 * Search matching shared by the data grid, kanban board, Gantt chart and calendar: pure, so it is unit-tested without a browser.
 *
 * A query is split on whitespace into terms; every term must appear (AND), in any order, ignoring case and diacritics
 * ("cafe" finds "Café"). An empty query matches everything.
 */

/** Lower-case and strip combining marks, so matching ignores case and diacritics. */
export function foldText(text: string): string {
    return text.normalize("NFD").replace(/\p{M}+/gu, "").toLowerCase();
}

/** The terms of a query, folded; empty when the query is blank. */
export function searchTerms(query: string): string[] {
    return foldText(query).split(/\s+/).filter(Boolean);
}

/** True when every term of `query` appears in `text`. */
export function matchesSearch(text: string, query: string): boolean {
    const terms = searchTerms(query);
    if (terms.length === 0) return true;
    const folded = foldText(text);
    return terms.every((term) => folded.includes(term));
}

export type SearchSegment = { text: string; match: boolean };

/**
 * `text` cut into runs, marking the parts any term matches (for `<mark>`). Folding can change a string's length (a precomposed "é"
 * is one character, its folded form too, but a ligature may not be), so matching works on a per-character fold and falls back to
 * one unmarked segment if the two ever disagree.
 */
export function highlightSegments(text: string, query: string): SearchSegment[] {
    const terms = searchTerms(query);
    if (terms.length === 0 || text === "") return [{ text, match: false }];
    const chars = Array.from(text);
    const folded = chars.map((c) => foldText(c));
    if (folded.some((f) => f.length !== 1)) return [{ text, match: false }];
    const flat = folded.join("");
    const marked = new Array<boolean>(chars.length).fill(false);
    for (const term of terms) {
        for (let at = flat.indexOf(term); at !== -1; at = flat.indexOf(term, at + 1)) {
            for (let i = at; i < at + term.length; i++) marked[i] = true;
        }
    }
    const out: SearchSegment[] = [];
    chars.forEach((c, i) => {
        const last = out[out.length - 1];
        if (last && last.match === marked[i]) last.text += c;
        else out.push({ text: c, match: marked[i] });
    });
    return out;
}
