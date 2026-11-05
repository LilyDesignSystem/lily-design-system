import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { afterEach } from "vitest";

import { BreadcrumbNav } from "./breadcrumb-nav.js";

if (!customElements.get("lily-breadcrumb-nav"))
    customElements.define("lily-breadcrumb-nav", BreadcrumbNav);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("BreadcrumbNav keyboard", () => {
    test("Tab walks its links, inside the named landmark", async () => {
        document.body.innerHTML =
            '<lily-breadcrumb-nav label="Trail"><a href="#first">First</a> <a href="#second">Second</a></lily-breadcrumb-nav>';
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement as HTMLElement;
        expect(first.textContent).toBe("First");
        expect(first.closest("nav")?.getAttribute("aria-label")).toBe("Trail");
        await user.tab();
        expect(document.activeElement?.textContent).toBe("Second");
    });

    test("Enter activates the focused link", async () => {
        document.body.innerHTML =
            '<lily-breadcrumb-nav label="Trail"><a href="#first">First</a> <a href="#second">Second</a></lily-breadcrumb-nav>';
        const user = userEvent.setup();
        const clicks = vi.fn();
        document.addEventListener("click", clicks);
        await user.tab();
        await user.keyboard("{Enter}");
        document.removeEventListener("click", clicks);
        expect(clicks).toHaveBeenCalledTimes(1);
    });
});
