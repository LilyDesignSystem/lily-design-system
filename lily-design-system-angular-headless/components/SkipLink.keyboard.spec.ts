import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { SkipLink } from "./SkipLink";

@Component({
    imports: [SkipLink],
    template: `<lily-skip-link href="#main" label="Skip to content"></lily-skip-link>`,
})
class Host0 {}

describe("SkipLink keyboard", () => {
    test("Tab reaches it first, and Enter activates it", async () => {
        TestBed.createComponent(Host0).detectChanges();
        const user = userEvent.setup();
        const clicks = vi.fn();
        document.addEventListener("click", clicks);
        await user.tab();
        const el = document.activeElement as HTMLAnchorElement;
        expect(el.matches("a.skip-link")).toBe(true);
        expect(el.getAttribute("href")).toBe("#main");
        await user.keyboard("{Enter}");
        document.removeEventListener("click", clicks);
        expect(clicks).toHaveBeenCalledTimes(1);
    });
});
