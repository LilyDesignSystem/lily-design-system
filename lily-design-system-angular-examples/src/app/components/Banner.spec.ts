import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Banner } from "./Banner";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Banner);
    for (const [key, value] of Object.entries({ label: "Notice", ...inputs }))
        fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("Banner", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("div.banner");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a polite region with its type", () => {
        const root = make({ type: "warning" }).nativeElement.querySelector("div");
        expect(root.getAttribute("role")).toBe("region");
        expect(root.getAttribute("aria-live")).toBe("polite");
        expect(root.getAttribute("aria-label")).toBe("Notice");
        expect(root.getAttribute("data-type")).toBe("warning");
    });

    test("type defaults to info", () => {
        expect(make().nativeElement.querySelector("div").getAttribute("data-type")).toBe("info");
    });

    test("there is no button unless dismissible", () => {
        expect(make().nativeElement.querySelector("button")).toBeNull();
    });

    test("dismissing removes it and emits closed", async () => {
        const fixture = make({ dismissible: true, closeLabel: "Dismiss" });
        let closed = 0;
        fixture.componentInstance.closed.subscribe(() => closed++);
        const button = fixture.nativeElement.querySelector("button");
        expect(button.getAttribute("aria-label")).toBe("Dismiss");
        button.click();
        await fixture.whenStable();
        expect(closed).toBe(1);
        expect(fixture.nativeElement.querySelector("div.banner")).toBeNull();
    });
});
