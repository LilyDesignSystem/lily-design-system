import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { CheckboxInput } from "./CheckboxInput";

@Component({
    imports: [CheckboxInput],
    template: `<lily-checkbox-input label="Agree"></lily-checkbox-input>`,
})
class Host0 {}

@Component({
    imports: [CheckboxInput],
    template: `<lily-checkbox-input label="Agree" [disabled]="true"></lily-checkbox-input>`,
})
class Host1 {}

describe("CheckboxInput keyboard", () => {
    test("Tab reaches it, and Space toggles it", async () => {
        TestBed.createComponent(Host0).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.checkbox-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Agree");
        expect(el.checked).toBe(false);
        await user.keyboard(" ");
        expect(el.checked).toBe(true);
        await user.keyboard(" ");
        expect(el.checked).toBe(false);
    });

    test("Tab skips it when disabled", async () => {
        TestBed.createComponent(Host1).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
