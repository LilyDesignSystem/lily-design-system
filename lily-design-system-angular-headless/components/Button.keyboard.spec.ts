import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { Button } from "./Button";

@Component({
    imports: [Button],
    template: `<lily-button label="Save">Save</lily-button>`,
})
class Host0 {}

describe("Button keyboard", () => {
    test("Tab reaches it, and Enter and Space activate it", async () => {
        TestBed.createComponent(Host0).detectChanges();
        const user = userEvent.setup();
        const clicks = vi.fn();
        document.addEventListener("click", clicks);
        await user.tab();
        expect((document.activeElement as HTMLElement).matches("button.button")).toBe(true);
        expect(document.activeElement?.getAttribute("aria-label")).toBe("Save");
        await user.keyboard("{Enter}");
        await user.keyboard(" ");
        document.removeEventListener("click", clicks);
        expect(clicks).toHaveBeenCalledTimes(2);
    });
});
