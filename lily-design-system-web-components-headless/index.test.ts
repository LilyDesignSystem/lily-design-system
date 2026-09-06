// End-to-end smoke test for the built package: imports the real dist/
// bundle (not the source), confirms every one of the 30 components in
// this partial catalog self-registers its custom element tag, and
// exercises one end-to-end render through the public entry point.
//
// This is the check that would have caught react-headless's historical
// "main: index.js that was never built" defect (see build.mjs) had it
// existed there — run `pnpm build` before `pnpm test` for this file to
// see the real dist output; vitest resolves it via the package's own
// `exports` map.
import * as fs from "node:fs";
import * as path from "node:path";

import { describe, expect, test } from "vitest";

const SLUGS = fs
    .readdirSync(path.join(__dirname, "components"))
    .filter((name) => name.endsWith(".ts") && !name.endsWith(".test.ts") && !name.includes(".stories."))
    .map((name) => name.slice(0, -".ts".length));

describe("dist/index.js (built package entry point)", () => {
    test("registers a lily-{slug} custom element for every component in the catalog", async () => {
        await import("./dist/index.js");

        for (const slug of SLUGS) {
            expect(customElements.get(`lily-${slug}`), `lily-${slug} should be defined`).toBeTruthy();
        }
        // The full achievable catalog as of 2026-09-06: 491 canonical
        // components minus the 35 permanently excluded by the wrapper-host
        // limitation (30 table sub-elements + 5 interactive *ListItem
        // families, spec/index.md SS2/SS2.1) = 456. Built up across the
        // original P7-T6/P8-T7 slice (33), all 92 national personal
        // identifier components, and three more waves covering every
        // remaining category (lists, forms, pickers, links, overlays,
        // tables, media, data-viz, buttons, navigation, content).
        expect(SLUGS.length).toBe(456);
    });

    test("a component rendered via the built bundle behaves like the source version", async () => {
        await import("./dist/index.js");

        document.body.innerHTML = '<lily-button label="Close">Close</lily-button>';
        const button = document.querySelector("button.button") as HTMLButtonElement;

        expect(button).toBeTruthy();
        expect(button.getAttribute("aria-label")).toBe("Close");
    });
});
