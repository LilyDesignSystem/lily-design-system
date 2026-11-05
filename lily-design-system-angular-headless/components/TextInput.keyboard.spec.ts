import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { TextInput } from "./TextInput";

@Component({
    imports: [TextInput],
    template: `<lily-text-input label="Name"></lily-text-input>`,
})
class Host0 {}

@Component({
    imports: [TextInput],
    template: `<lily-text-input label="Name" [disabled]="true"></lily-text-input>`,
})
class Host1 {}

describe("TextInput keyboard", () => {
    test("Tab reaches it, and typing fills it", async () => {
        TestBed.createComponent(Host0).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.text-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
        await user.keyboard("Ada");
        expect(el.value).toBe("Ada");
    });

    test("Tab skips it when disabled", async () => {
        TestBed.createComponent(Host1).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
