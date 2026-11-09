import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CallToAction } from "./CallToAction";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(CallToAction);
    for (const [key, value] of Object.entries({ ...inputs }))
        fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("CallToAction", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector(
            "button.call-to-action",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("with href it is a link", () => {
        const root = make({ href: "/join", label: "Join us" }).nativeElement;
        const link = root.querySelector("a.call-to-action");
        expect(root.querySelector("div")).toBeNull();
        expect(link.getAttribute("href")).toBe("/join");
        expect(link.getAttribute("aria-label")).toBe("Join us");
        expect(root.querySelector("button")).toBeNull();
    });

    test("without href it is a button", () => {
        const root = make({ disabled: true }).nativeElement;
        const button = root.querySelector("button.call-to-action");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.disabled).toBe(true);
        expect(root.querySelector("a")).toBeNull();
    });
});
