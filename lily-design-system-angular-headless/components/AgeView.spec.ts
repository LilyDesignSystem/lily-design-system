import { TestBed } from "@angular/core/testing";
import { describe, expect, test } from "vitest";

import { AgeView } from "./AgeView";

describe("AgeView", () => {
    test("renders the consumer's words and the duration as data", () => {
        const fixture = TestBed.createComponent(AgeView);
        fixture.componentRef.setInput("label", "Age");
        fixture.componentRef.setInput("value", "3 weeks 2 days");
        fixture.componentRef.setInput("duration", "P23D");
        fixture.detectChanges();
        const root = fixture.nativeElement.querySelector(".age-view") as HTMLElement;
        expect(root.tagName).toBe("SPAN");
        expect(root.getAttribute("data-duration")).toBe("P23D");
        expect(root.textContent).toBe("Age 3 weeks 2 days");
        expect(root.hasAttribute("aria-label")).toBe(false);
    });
});
