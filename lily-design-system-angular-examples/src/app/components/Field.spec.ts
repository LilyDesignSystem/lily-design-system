import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Field } from "./Field";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Field);
    for (const [key, value] of Object.entries({ label: "Name", ...inputs }))
        fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("Field", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("div.field");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("the label points at the control", () => {
        const root = make({ inputId: "name" }).nativeElement;
        expect(root.querySelector("label").getAttribute("for")).toBe("name");
        expect(root.querySelector("label").textContent.trim()).toBe("Name");
    });

    test("with no label, none is rendered", () => {
        expect(make({ label: "" }).nativeElement.querySelector("label")).toBeNull();
    });

    test("required marks it, with a hidden asterisk", () => {
        const root = make({ required: true }).nativeElement;
        expect(root.querySelector("div").getAttribute("data-required")).toBe("true");
        expect(root.querySelector("label span").getAttribute("aria-hidden")).toBe("true");
    });

    test("description and error, and only the error is an alert", () => {
        const root = make({ inputId: "n", description: "Help", error: "Bad" }).nativeElement;
        expect(root.querySelector("#n-desc").textContent).toBe("Help");
        expect(root.querySelector("#n-error").getAttribute("role")).toBe("alert");
        expect(root.querySelector("div.field").hasAttribute("role")).toBe(false);
    });
});
