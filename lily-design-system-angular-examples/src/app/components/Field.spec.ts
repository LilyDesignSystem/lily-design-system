import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { EmailInput } from "./EmailInput";
import { Field } from "./Field";
import { TextInput } from "./TextInput";

// P38-T3: lily-field around a Lily input component labels the <input> inside it.
@Component({
    standalone: true,
    imports: [Field, EmailInput, TextInput],
    template: `
        <lily-field label="Email address" inputId="email">
            <lily-email-input id="email" label="Email address" />
        </lily-field>
        <lily-field label="Full name" inputId="name">
            <lily-text-input id="name" label="Full name" />
        </lily-field>
    `,
})
class FieldAroundInputs {}

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Field);
    for (const [key, value] of Object.entries({ label: "Name", ...inputs }))
        fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("Field", () => {
    test("labels the <input> inside a Lily input component, with one element per id", () => {
        const fixture = TestBed.createComponent(FieldAroundInputs);
        fixture.detectChanges();
        const root: HTMLElement = fixture.nativeElement;
        for (const [id, text] of [
            ["email", "Email address"],
            ["name", "Full name"],
        ]) {
            const input = root.querySelector(`input#${id}`) as HTMLInputElement;
            expect(input).toBeTruthy();
            expect(input.labels).toHaveLength(1);
            expect(input.labels![0]!.textContent!.trim()).toBe(text);
            expect(root.querySelectorAll(`#${id}`)).toHaveLength(1);
        }
    });

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
