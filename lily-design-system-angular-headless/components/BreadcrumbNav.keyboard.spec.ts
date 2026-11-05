import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { BreadcrumbNav } from "./BreadcrumbNav";

@Component({
    imports: [BreadcrumbNav],
    template: `<lily-breadcrumb-nav label="Trail"><a href="#first">First</a> <a href="#second">Second</a></lily-breadcrumb-nav>`,
})
class Host0 {}

@Component({
    imports: [BreadcrumbNav],
    template: `<lily-breadcrumb-nav label="Trail"><a href="#first">First</a> <a href="#second">Second</a></lily-breadcrumb-nav>`,
})
class Host1 {}

describe("BreadcrumbNav keyboard", () => {
    test("Tab walks its links, inside the named landmark", async () => {
        TestBed.createComponent(Host0).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement as HTMLElement;
        expect(first.textContent).toBe("First");
        expect(first.closest("nav")?.getAttribute("aria-label")).toBe("Trail");
        await user.tab();
        expect(document.activeElement?.textContent).toBe("Second");
    });

    test("Enter activates the focused link", async () => {
        TestBed.createComponent(Host1).detectChanges();
        const user = userEvent.setup();
        const clicks = vi.fn();
        document.addEventListener("click", clicks);
        await user.tab();
        await user.keyboard("{Enter}");
        document.removeEventListener("click", clicks);
        expect(clicks).toHaveBeenCalledTimes(1);
    });
});
