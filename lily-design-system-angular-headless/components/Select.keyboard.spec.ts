import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { Select } from "./Select";

@Component({
    imports: [Select],
    template: `<lily-select label="Colour"><option value="a">A</option><option value="b">B</option></lily-select>`,
})
class Host0 {}

describe("Select keyboard", () => {
    test("Tab reaches it, by name", async () => {
        TestBed.createComponent(Host0).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("select.select")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Colour");
    });
});
