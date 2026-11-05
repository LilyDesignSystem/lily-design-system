import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PasswordInputOrTextInputDiv } from "./PasswordInputOrTextInputDiv";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(PasswordInputOrTextInputDiv);
    for (const [key, value] of Object.entries({ label: "Password", toggleLabel: "Show", ...inputs })) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

const type = (el: HTMLInputElement | HTMLTextAreaElement, value: string) => {
    el.value = value;
    el.dispatchEvent(new Event("input"));
};

describe("PasswordInputOrTextInputDiv", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("div.password-input-or-text-input-div");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("the toggle shows and hides the text", async () => {
        const fixture = make();
        const root = fixture.nativeElement;
        const field = root.querySelector("input");
        const button = root.querySelector("button");
        expect(field.type).toBe("password");
        expect(field.getAttribute("autocomplete")).toBe("current-password");
        expect(button.getAttribute("aria-pressed")).toBe("false");
        button.click();
        await fixture.whenStable();
        expect(field.type).toBe("text");
        expect(button.getAttribute("aria-pressed")).toBe("true");
    });

    test("value is two-way", () => {
        const fixture = make();
        type(fixture.nativeElement.querySelector("input"), "secret");
        expect(fixture.componentInstance.value()).toBe("secret");
    });

    test("showToggle hides the button", () => {
        expect(make({ showToggle: false }).nativeElement.querySelector("button")).toBeNull();
    });
});
