import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { DateInput } from "./DateInput";

@Component({
    imports: [DateInput],
    template: `<lily-date-input label="Name"></lily-date-input>`,
})
class Host0 {}

@Component({
    imports: [DateInput],
    template: `<lily-date-input label="Name" [disabled]="true"></lily-date-input>`,
})
class Host1 {}

describe("DateInput keyboard", () => {
    test("Tab reaches it, by name", async () => {
        TestBed.createComponent(Host0).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.date-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
    });

    test("Tab skips it when disabled", async () => {
        TestBed.createComponent(Host1).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
