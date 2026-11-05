import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./AccordionNav";

describe("AccordionNav keyboard", () => {
    test("is a named navigation landmark", async () => {
        render(<Subject label="Sections">Content</Subject>);

        const el = document.querySelector("nav.accordion-nav");
        expect(el?.hasAttribute("role")).toBe(false);
        expect(el?.getAttribute("aria-label")).toBe("Sections");
    });
});
