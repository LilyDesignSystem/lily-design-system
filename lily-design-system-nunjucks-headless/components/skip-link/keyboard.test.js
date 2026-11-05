// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { render } from "../../test/render.js";

describe("skip-link keyboard", () => {
    test("Tab reaches it first, and Enter activates it", async () => {
        document.body.innerHTML = render("skip-link", {
            href: "#main",
            text: "Skip to content",
        }).html;
        const user = userEvent.setup();
        const clicks = vi.fn();
        document.addEventListener("click", clicks);
        await user.tab();
        const el = document.activeElement;
        expect(el.matches("a.skip-link")).toBe(true);
        expect(el.getAttribute("href")).toBe("#main");
        await user.keyboard("{Enter}");
        document.removeEventListener("click", clicks);
        expect(clicks).toHaveBeenCalledTimes(1);
    });
});
