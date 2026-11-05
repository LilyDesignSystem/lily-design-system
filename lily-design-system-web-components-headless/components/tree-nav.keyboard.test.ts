import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { afterEach } from "vitest";

import { TreeNav } from "./tree-nav.js";

if (!customElements.get("lily-tree-nav")) customElements.define("lily-tree-nav", TreeNav);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("TreeNav keyboard", () => {
    test("Tab walks its links, inside the named landmark", async () => {
        document.body.innerHTML =
            '<lily-tree-nav label="Trail"><a href="#first">First</a> <a href="#second">Second</a></lily-tree-nav>';
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
            '<lily-tree-nav label="Trail"><a href="#first">First</a> <a href="#second">Second</a></lily-tree-nav>';
        const user = userEvent.setup();
        const clicks = vi.fn();
        document.addEventListener("click", clicks);
        await user.tab();
        await user.keyboard("{Enter}");
        document.removeEventListener("click", clicks);
        expect(clicks).toHaveBeenCalledTimes(1);
    });
});
