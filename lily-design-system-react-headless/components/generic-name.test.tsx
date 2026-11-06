// Every component rendered with a label: a plain <div> or <span> cannot be named, because ARIA gives its
// generic role no name (tasks.md P25-T14). generic-name.allow.json holds the known cases and may only shrink.
import { createElement } from "react";
import { cleanup, render } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import allowList from "./generic-name.allow.json";
import { baselinePath, compareWithBaseline, rootAria, type Seen } from "../../shared/aria-baseline";
import path from "node:path";

// @ts-expect-error Vite replaces import.meta.glob at build time.
const mods = import.meta.glob(["./*.tsx", "!./*.test.tsx", "!./*.stories.tsx"], {
    eager: true,
}) as Record<string, any>;
const allow: string[] = allowList;
const named = (el: Element | null | undefined) =>
    !!el &&
    ["DIV", "SPAN"].includes(el.tagName.toUpperCase()) &&
    el.hasAttribute("aria-label") &&
    !el.hasAttribute("role");
const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const seen: Seen = {};

test("no component names a generic root", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const hits: string[] = [];
    for (const [path, mod] of Object.entries(mods)) {
        if (!mod.default) continue;
        for (const extra of [{ children: "x" }, {}]) {
            try {
                const { container } = render(
                    createElement(mod.default, {
                        label: "Example",
                        value: "1",
                        alt: "A",
                        src: "/a",
                        href: "/",
                        title: "T",
                        name: "n",
                        background: "b",
                        media: "m",
                        primary: "p",
                        secondary: "s",
                        ...extra,
                    }),
                );
                const rendered = container.firstElementChild;
                if (rendered) seen[kebab(path.slice(2, -4))] = rootAria(rendered);
                if (named(container.firstElementChild)) hits.push(kebab(path.slice(2, -4)));
                cleanup();
                break;
            } catch {
                cleanup();
            }
        }
    }
    const unexpected = hits.filter((s) => !allow.includes(s));
    const stale = allow.filter((s) => !hits.includes(s));
    expect(unexpected, "names a generic root: use a role, or no label").toEqual([]);
    expect(stale, "fixed: remove from generic-name.allow.json").toEqual([]);
}, 180000);

test("every root matches the Svelte ARIA baseline", () => {
    expect(Object.keys(seen).length, "the sweep above ran first").toBeGreaterThan(500);
    const { unexpected, stale } = compareWithBaseline(
        baselinePath(__dirname),
        path.join(__dirname, "aria-baseline.allow.json"),
        seen,
    );
    expect(unexpected, "differs from what Svelte renders").toEqual([]);
    expect(stale, "fixed: remove from aria-baseline.allow.json").toEqual([]);
});
