import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GovernmentBanner } from "./GovernmentBanner";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(GovernmentBanner);
    for (const [key, value] of Object.entries({
        label: "Official",
        headerText: "An official site",
        expandLabel: "How you know",
        ...inputs,
    }))
        fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("GovernmentBanner", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector(
            "aside.government-banner",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("the toggle controls the panel", async () => {
        const fixture = make({ panelId: "panel" });
        const root = fixture.nativeElement;
        expect(root.querySelector(".government-banner-headline").textContent).toBe(
            "An official site",
        );
        const toggle = root.querySelector("button.government-banner-toggle");
        expect(toggle.textContent.trim()).toBe("How you know");
        expect(toggle.getAttribute("aria-controls")).toBe("panel");
        expect(toggle.getAttribute("aria-expanded")).toBe("false");
        expect(root.querySelector("#panel").hidden).toBe(true);
        toggle.click();
        await fixture.whenStable();
        expect(toggle.getAttribute("aria-expanded")).toBe("true");
        expect(root.querySelector("#panel").hidden).toBe(false);
    });

    test("the panel has an id without one given", () => {
        const root = make().nativeElement;
        expect(root.querySelector(".government-banner-details").id).toBe(
            root.querySelector("button").getAttribute("aria-controls"),
        );
        expect(root.querySelector(".government-banner-details").id).not.toBe("");
    });
});
