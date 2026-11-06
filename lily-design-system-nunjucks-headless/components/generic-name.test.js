// Every component rendered with a label: a plain <div> or <span> cannot be named, because ARIA gives its
// generic role no name (tasks.md P25-T14). generic-name.allow.json holds the known cases and may only shrink.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";
import { baselinePath, compareWithBaseline, rootAria } from "../../shared/aria-baseline";
import { render } from "../test/render.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const allowPath = path.join(here, "generic-name.allow.json");
const allow = JSON.parse(fs.readFileSync(allowPath, "utf8"));
const slugs = fs
    .readdirSync(here)
    .filter((name) => fs.existsSync(path.join(here, name, "macro.njk")));

const seen = {};

test("no component names a generic root", () => {
    const hits = [];
    for (const slug of slugs) {
        try {
            const { document } = render(
                slug,
                {
                    label: "Example",
                    value: "1",
                    alt: "A",
                    src: "/a",
                    href: "/",
                    title: "T",
                    name: "n",
                    text: "T",
                    id: "x",
                },
                "x",
            );
            const el = document.querySelector("." + slug) ?? document.body.firstElementChild;
            if (el) seen[slug] = rootAria(el);
            if (
                el &&
                ["DIV", "SPAN"].includes(el.tagName) &&
                el.hasAttribute("aria-label") &&
                !el.hasAttribute("role")
            )
                hits.push(slug);
        } catch {
            // Needs params this sweep does not give; its own test covers it.
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
        baselinePath(here),
        path.join(here, "aria-baseline.allow.json"),
        seen,
    );
    expect(unexpected, "differs from what Svelte renders").toEqual([]);
    expect(stale, "fixed: remove from aria-baseline.allow.json").toEqual([]);
});
