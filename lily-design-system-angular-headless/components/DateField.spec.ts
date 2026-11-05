import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DateField } from "./DateField";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(DateField);
    for (const [key, value] of Object.entries({ label: "Birthday", ...inputs }))
        fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

const type = (el: HTMLInputElement | HTMLTextAreaElement, value: string) => {
    el.value = value;
    el.dispatchEvent(new Event("input"));
};

describe("DateField", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("div.date-field");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("the label names a date input", () => {
        const root = make({ id: "when" }).nativeElement;
        expect(root.querySelector("label").getAttribute("for")).toBe("when");
        const field = root.querySelector("input.date-input");
        expect(field.id).toBe("when");
        expect(field.type).toBe("date");
    });

    test("an id is generated without one given", () => {
        const root = make().nativeElement;
        expect(root.querySelector("input").id).not.toBe("");
        expect(root.querySelector("label").getAttribute("for")).toBe(
            root.querySelector("input").id,
        );
    });

    test("description and error are linked", () => {
        const root = make({ id: "d", description: "Help", error: "Bad" }).nativeElement;
        const field = root.querySelector("input");
        expect(field.getAttribute("aria-describedby")).toBe("d-desc");
        expect(field.getAttribute("aria-invalid")).toBe("true");
        expect(field.getAttribute("aria-errormessage")).toBe("d-error");
        expect(root.querySelector("#d-desc").textContent).toBe("Help");
        expect(root.querySelector("#d-error").getAttribute("role")).toBe("alert");
    });

    test("with neither, nothing is linked and the root is no alert", () => {
        const root = make().nativeElement;
        expect(root.querySelector("input").hasAttribute("aria-invalid")).toBe(false);
        expect(root.querySelector("[role=alert]")).toBeNull();
    });

    test("value is two-way", () => {
        const fixture = make();
        type(fixture.nativeElement.querySelector("input"), "2026-11-05");
        expect(fixture.componentInstance.value()).toBe("2026-11-05");
    });
});
