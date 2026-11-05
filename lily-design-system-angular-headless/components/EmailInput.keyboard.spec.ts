import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { EmailInput } from "./EmailInput";

@Component({
    imports: [EmailInput],
    template: `<lily-email-input label="Name"></lily-email-input>`,
})
class Host0 {}

@Component({
    imports: [EmailInput],
    template: `<lily-email-input label="Name" [disabled]="true"></lily-email-input>`,
})
class Host1 {}

describe("EmailInput keyboard", () => {
    test("Tab reaches it, and typing fills it", async () => {
        TestBed.createComponent(Host0).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.email-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
        await user.keyboard("a@b.org");
        expect(el.value).toBe("a@b.org");
    });

    test("Tab skips it when disabled", async () => {
        TestBed.createComponent(Host1).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
