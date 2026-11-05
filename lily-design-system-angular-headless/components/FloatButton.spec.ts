import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FloatButton } from "./FloatButton";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(FloatButton);
    for (const [key, value] of Object.entries({ label: "Help", ...inputs })) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("FloatButton", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("button.float-button");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is named, and defaults to the bottom right", () => {
        const button = make().nativeElement.querySelector("button");
        expect(button.getAttribute("aria-label")).toBe("Help");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("data-position")).toBe("bottom-right");
        expect(button.getAttribute("style")).toBe("position: fixed; bottom: 1rem; right: 1rem;");
    });

    test("position, type and disabled are passed on", () => {
        const button = make({ position: "top-left", type: "submit", disabled: true }).nativeElement.querySelector("button");
        expect(button.getAttribute("data-position")).toBe("top-left");
        expect(button.getAttribute("style")).toBe("position: fixed; top: 1rem; left: 1rem;");
        expect(button.type).toBe("submit");
        expect(button.disabled).toBe(true);
    });
});
