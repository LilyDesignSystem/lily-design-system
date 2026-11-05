import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { CheckboxGroup } from "./CheckboxGroup";

@Component({
    imports: [CheckboxGroup],
    template: `<lily-checkbox-group label="Toppings"><input type="checkbox" aria-label="Ham" /><input type="checkbox" aria-label="Egg" /></lily-checkbox-group>`,
})
class Host0 {}

describe("CheckboxGroup keyboard", () => {
    test("Tab and Space work inside the named group", async () => {
        TestBed.createComponent(Host0).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement as HTMLInputElement;
        expect(first.closest(".checkbox-group")?.getAttribute("aria-label")).toBe("Toppings");
        expect(first.closest(".checkbox-group")?.getAttribute("role")).toBe("group");
        await user.keyboard(" ");
        expect(first.checked).toBe(true);
        await user.tab();
        expect(document.activeElement?.getAttribute("aria-label")).toBe("Egg");
    });
});
