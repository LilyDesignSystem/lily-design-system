// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { render } from "../../test/render.js";

describe("tree-nav keyboard", () => {
    test("Tab walks its links, inside the named landmark", async () => {
        document.body.innerHTML = render("tree-nav", {
            label: "Trail",
            html: '<a href="#first">First</a> <a href="#second">Second</a>',
        }).html;
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement;
        expect(first.textContent).toBe("First");
        expect(first.closest("nav")?.getAttribute("aria-label")).toBe("Trail");
        await user.tab();
        expect(document.activeElement?.textContent).toBe("Second");
    });

    test("Enter activates the focused link", async () => {
        document.body.innerHTML = render("tree-nav", {
            label: "Trail",
            html: '<a href="#first">First</a> <a href="#second">Second</a>',
        }).html;
        const user = userEvent.setup();
        const clicks = vi.fn();
        document.addEventListener("click", clicks);
        await user.tab();
        await user.keyboard("{Enter}");
        document.removeEventListener("click", clicks);
        expect(clicks).toHaveBeenCalledTimes(1);
    });
});
