import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { NumberInput } from "./NumberInput";

@Component({
    imports: [NumberInput],
    template: `<lily-number-input label="Name"></lily-number-input>`,
})
class Host0 {}

@Component({
    imports: [NumberInput],
    template: `<lily-number-input label="Name" [disabled]="true"></lily-number-input>`,
})
class Host1 {}

describe("NumberInput keyboard", () => {
    test("Tab reaches it, and typing fills it", async () => {
        TestBed.createComponent(Host0).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.number-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
        await user.keyboard("42");
        expect(el.value).toBe("42");
    });

    test("Tab skips it when disabled", async () => {
        TestBed.createComponent(Host1).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
