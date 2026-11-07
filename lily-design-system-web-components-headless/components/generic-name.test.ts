/// <reference types="vite/client" />
// Every component rendered with a label: a plain <div> or <span> cannot be named, because ARIA gives its
// generic role no name (tasks.md P25-T14). generic-name.allow.json holds the known cases and may only shrink.
import { expect, test, vi } from "vitest";
import allowList from "./generic-name.allow.json";
import { baselinePath, compareWithBaseline, rootAria, type Seen } from "../../shared/aria-baseline";
import path from "node:path";

const mods = import.meta.glob(["./*.ts", "!./*.test.ts", "!./*.stories.ts", "!./index.ts"], {
    eager: true,
}) as Record<string, any>;
const allow: string[] = allowList;

const seen: Seen = {};

test("no component names a generic root", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const hits: string[] = [];
    for (const [path, mod] of Object.entries(mods)) {
        const slug = path.slice(2, -3);
        const Element = Object.values(mod).find(
            (value: any) => typeof value === "function" && value.prototype instanceof HTMLElement,
        ) as any;
        if (!Element) continue;
        const tag = "lily-" + slug;
        try {
            if (!customElements.get(tag)) customElements.define(tag, Element);
            document.body.innerHTML =
                "<" + tag + ' label="Example" value="1" alt="A" src="/a"></' + tag + ">";
            const host = document.body.firstElementChild as HTMLElement;
            // A custom element has no role of its own, so a named host is as generic as a named <div>.
            // An upgrade-in-place component has replaced its host with a native element such as <li>, which does.
            const generic = host.localName.includes("-") || ["DIV", "SPAN"].includes(host.tagName);
            const inner = host.firstElementChild;
            // The element carrying the class: the host itself, or the first child a wrapper host renders.
            const root = host.classList.contains(slug)
                ? host
                : (host.querySelector(`.${slug}`) ?? inner);
            if (root) seen[slug] = rootAria(root);
            const namedInner =
                inner &&
                ["DIV", "SPAN"].includes(inner.tagName) &&
                inner.hasAttribute("aria-label") &&
                !inner.hasAttribute("role");
            if (
                (generic && host.hasAttribute("aria-label") && !host.hasAttribute("role")) ||
                (!host.hasAttribute("aria-label") && namedInner)
            )
                hits.push(slug);
        } catch {
            // Needs attributes this sweep does not give; its own test covers it.
        }
        document.body.innerHTML = "";
    }
    const unexpected = hits.filter((s) => !allow.includes(s));
    const stale = allow.filter((s) => !hits.includes(s));
    expect(unexpected, "names a generic root: use a role, or no label").toEqual([]);
    expect(stale, "fixed: remove from generic-name.allow.json").toEqual([]);
}, 180000);

test("every root matches the Svelte ARIA baseline", () => {
    expect(Object.keys(seen).length, "the sweep above ran first").toBeGreaterThan(400);
    const { unexpected, stale } = compareWithBaseline(
        baselinePath(__dirname),
        path.join(__dirname, "aria-baseline.allow.json"),
        seen,
    );
    expect(unexpected, "differs from what Svelte renders").toEqual([]);
    expect(stale, "fixed: remove from aria-baseline.allow.json").toEqual([]);
});
