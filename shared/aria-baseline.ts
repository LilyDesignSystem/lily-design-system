// What the Svelte reference renders on each component's root: its role and its aria-* attribute names. The render sweeps in
// the other catalogs compare themselves with aria-baseline.json, so a port that drops a role fails (tasks.md P25-T7). It is
// generated from what Svelte renders, not from the prose in each `## ARIA` section, which is too conditional to parse.
// Regenerate: UPDATE_ARIA_BASELINE=1 pnpm exec vitest run components/generic-name, in the Svelte catalog.
import fs from "node:fs";
import path from "node:path";

export interface RootAria {
    role: string | null;
    aria: string[];
}
export type Seen = Record<string, RootAria>;

export const rootAria = (el: Element): RootAria => ({
    role: el.getAttribute("role"),
    aria: el
        .getAttributeNames()
        .filter((name) => name.startsWith("aria-"))
        .sort(),
});

/** "slug role" or "slug aria-x" for each way `seen` falls short of the baseline. A component the sweep could not render is skipped. */
export function ariaDiffs(baseline: Seen, seen: Seen): string[] {
    const diffs: string[] = [];
    for (const [slug, want] of Object.entries(baseline)) {
        const got = seen[slug];
        if (!got) continue;
        if (want.role !== got.role) diffs.push(`${slug} role`);
        for (const name of want.aria) if (!got.aria.includes(name)) diffs.push(`${slug} ${name}`);
    }
    return diffs.sort();
}

/** The two lists a sweep must keep empty: differences not on its allow-list, and entries that no longer differ. */
export function compareWithBaseline(baselineFile: string, allowFile: string, seen: Seen) {
    const baseline = JSON.parse(fs.readFileSync(baselineFile, "utf-8")) as Seen;
    const diffs = ariaDiffs(baseline, seen);
    if (process.env["UPDATE_ARIA_ALLOW"]) {
        const known = fs.existsSync(allowFile) ? JSON.parse(fs.readFileSync(allowFile, "utf-8")) : {};
        const next = Object.fromEntries(
            diffs.map((key) => [key, known[key] ?? "Not ported yet (tasks.md P25-T7)."]),
        );
        fs.writeFileSync(allowFile, `${JSON.stringify(next, null, 2)}\n`);
    }
    const allow = JSON.parse(fs.readFileSync(allowFile, "utf-8")) as Record<string, string>;
    return {
        unexpected: diffs.filter((key) => !allow[key]),
        stale: Object.keys(allow).filter((key) => !diffs.includes(key)),
    };
}

export const baselinePath = (dir: string) => path.join(dir, "../../shared/aria-baseline.json");
