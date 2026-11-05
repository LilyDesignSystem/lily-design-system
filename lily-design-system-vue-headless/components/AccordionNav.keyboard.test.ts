import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./AccordionNav.vue";

describe("AccordionNav keyboard", () => {
    test("is a named navigation landmark", async () => {
        render(Subject, { props: { label: "Sections" }, slots: { default: "Content" } });

        const el = document.querySelector("nav.accordion-nav");
        expect(el?.hasAttribute("role")).toBe(false);
        expect(el?.getAttribute("aria-label")).toBe("Sections");
    });
});
