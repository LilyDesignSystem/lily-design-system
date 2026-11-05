import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { AccordionNav } from "./accordion-nav.js";

if (!customElements.get("lily-accordion-nav"))
    customElements.define("lily-accordion-nav", AccordionNav);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("AccordionNav keyboard", () => {
    test("is a named navigation landmark", async () => {
        document.body.innerHTML =
            '<lily-accordion-nav label="Sections">Content</lily-accordion-nav>';

        const el = document.querySelector("nav.accordion-nav");
        expect(el?.hasAttribute("role")).toBe(false);
        expect(el?.getAttribute("aria-label")).toBe("Sections");
    });
});
