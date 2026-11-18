// End-to-end smoke test for the built package: imports the real dist/
// bundle (not the source), confirms every national identifier component
// self-registers its custom element tag, and
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
    .filter(
        (name) => name.endsWith(".ts") && !name.endsWith(".test.ts") && !name.includes(".stories."),
    )
    .map((name) => name.slice(0, -".ts".length));

describe("dist/index.js (built package entry point)", () => {
    test("registers a lily-{slug} custom element for every component in the catalog", async () => {
        await import("./dist/index.js");

        for (const slug of SLUGS) {
            expect(
                customElements.get(`lily-${slug}`),
                `lily-${slug} should be defined`,
            ).toBeTruthy();
        }
        // The 188 national personal identifier components (94 identifier types, an input and a view each),
        // moved here from web-components-headless (spec/headless-identifiers).
        expect(SLUGS.length).toBe(188);
    });

    test("a component rendered via the built bundle behaves like the source version", async () => {
        await import("./dist/index.js");

        document.body.innerHTML =
            '<lily-united-kingdom-national-health-service-number-input label="NHS number"></lily-united-kingdom-national-health-service-number-input>';
        const input = document.querySelector(
            "input.united-kingdom-national-health-service-number-input",
        ) as HTMLInputElement;

        expect(input).toBeTruthy();
        expect(input.getAttribute("aria-label")).toBe("NHS number");
    });
});
