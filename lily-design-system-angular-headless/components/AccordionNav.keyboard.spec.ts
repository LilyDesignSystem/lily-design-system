import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { AccordionNav } from "./AccordionNav";

@Component({
    imports: [AccordionNav],
    template: `<lily-accordion-nav label="Sections">Content</lily-accordion-nav>`,
})
class Host0 {}

describe("AccordionNav keyboard", () => {
    test("is a named navigation landmark", async () => {
        TestBed.createComponent(Host0).detectChanges();

        const el = document.querySelector("nav.accordion-nav");
        expect(el?.hasAttribute("role")).toBe(false);
        expect(el?.getAttribute("aria-label")).toBe("Sections");
    });
});
