import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { PasswordInput } from "./PasswordInput";

@Component({
    imports: [PasswordInput],
    template: `<lily-password-input label="Name"></lily-password-input>`,
})
class Host0 {}

@Component({
    imports: [PasswordInput],
    template: `<lily-password-input label="Name" [disabled]="true"></lily-password-input>`,
})
class Host1 {}

describe("PasswordInput keyboard", () => {
    test("Tab reaches it, and typing fills it", async () => {
        TestBed.createComponent(Host0).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.password-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
        await user.keyboard("secret");
        expect(el.value).toBe("secret");
    });

    test("Tab skips it when disabled", async () => {
        TestBed.createComponent(Host1).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
