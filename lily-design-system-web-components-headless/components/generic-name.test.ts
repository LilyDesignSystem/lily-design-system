/// <reference types="vite/client" />
// Every component rendered with a label: a plain <div> or <span> cannot be named, because ARIA gives its
// generic role no name (tasks.md P25-T14). generic-name.allow.json holds the known cases and may only shrink.
import { expect, test, vi } from "vitest";
import allowList from "./generic-name.allow.json";

const mods = import.meta.glob(["./*.ts", "!./*.test.ts", "!./*.stories.ts", "!./index.ts"], {
    eager: true,
}) as Record<string, any>;
const allow: string[] = allowList;

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
            const inner = host.firstElementChild;
            const namedInner =
                inner &&
                ["DIV", "SPAN"].includes(inner.tagName) &&
                inner.hasAttribute("aria-label") &&
                !inner.hasAttribute("role");
            if (
                (host.hasAttribute("aria-label") && !host.hasAttribute("role")) ||
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
