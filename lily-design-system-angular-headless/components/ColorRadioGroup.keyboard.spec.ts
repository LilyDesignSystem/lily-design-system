import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { ColorRadioGroup } from "./ColorRadioGroup";

@Component({
    imports: [ColorRadioGroup],
    template: `<lily-color-radio-group label="Size"><input type="radio" name="size" aria-label="S" /><input type="radio" name="size" aria-label="M" /></lily-color-radio-group>`,
})
class Host0 {}

describe("ColorRadioGroup keyboard", () => {
    test("arrows walk the radios inside the named group", async () => {
        TestBed.createComponent(Host0).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement as HTMLInputElement;
        expect(first.closest(".color-radio-group")?.getAttribute("aria-label")).toBe("Size");
        expect(first.closest(".color-radio-group")?.getAttribute("role")).toBe("radiogroup");
        await user.keyboard("{ArrowDown}");
        const next = document.activeElement as HTMLInputElement;
        expect(next.getAttribute("aria-label")).toBe("M");
        expect(next.checked).toBe(true);
    });
});
