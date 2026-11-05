import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Coachmark } from "./Coachmark";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Coachmark);
    for (const [key, value] of Object.entries({ title: "New", dismissLabel: "Close", ...inputs })) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("Coachmark", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("div.coachmark");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a manual popover, hidden until open", async () => {
        const fixture = make();
        const root = fixture.nativeElement.querySelector("div");
        expect(root.getAttribute("role")).toBe("dialog");
        expect(root.hidden).toBe(true);
        fixture.componentRef.setInput("open", true);
        await fixture.whenStable();
        expect(root.hidden).toBe(false);
    });

    test("the title names it and the description describes it", () => {
        const root = make({ description: "Look here." }).nativeElement;
        const panel = root.querySelector("div");
        expect(panel.getAttribute("aria-modal")).toBe("false");
        expect(panel.getAttribute("aria-labelledby")).toBe(root.querySelector("h2.coachmark-title").id);
        expect(panel.getAttribute("aria-describedby")).toBe(root.querySelector("p.coachmark-description").id);
        expect(make().nativeElement.querySelector("div").hasAttribute("aria-describedby")).toBe(false);
    });

    test("the button reports", () => {
        const fixture = make();
        let dismissed = 0;
        fixture.componentInstance.dismissed.subscribe(() => dismissed++);
        const button = fixture.nativeElement.querySelector("button.coachmark-dismiss");
        expect(button.getAttribute("aria-label")).toBe("Close");
        button.click();
        expect(dismissed).toBe(1);
    });
});
