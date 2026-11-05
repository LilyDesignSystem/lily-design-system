import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Expander } from "./Expander";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Expander);
    for (const [key, value] of Object.entries({ label: "More", ...inputs })) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("Expander", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("div.expander");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("the button controls a region that exists only while expanded", async () => {
        const fixture = make();
        const button = fixture.nativeElement.querySelector("button");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(button.textContent.trim()).toBe("More");
        expect(fixture.nativeElement.querySelector("[role=region]")).toBeNull();
        button.click();
        await fixture.whenStable();
        const region = fixture.nativeElement.querySelector("[role=region]");
        expect(button.getAttribute("aria-expanded")).toBe("true");
        expect(button.getAttribute("aria-controls")).toBe(region.id);
        expect(region.getAttribute("aria-label")).toBe("More");
    });

    test("expanded is two-way", () => {
        const fixture = make();
        let seen: boolean | undefined;
        fixture.componentInstance.expanded.subscribe((value: boolean) => (seen = value));
        fixture.nativeElement.querySelector("button").click();
        expect(seen).toBe(true);
    });

    test("each instance has its own region id", () => {
        const a = make({ expanded: true }).nativeElement.querySelector("[role=region]").id;
        const b = make({ expanded: true }).nativeElement.querySelector("[role=region]").id;
        expect(a).not.toBe(b);
    });
});
