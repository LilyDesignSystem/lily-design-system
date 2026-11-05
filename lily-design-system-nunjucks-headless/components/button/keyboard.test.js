// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { render } from "../../test/render.js";

describe("button keyboard", () => {
    test("Tab reaches it, and Enter and Space activate it", async () => {
        document.body.innerHTML = render("button", { label: "Save", html: "Save" }).html;
        const user = userEvent.setup();
        const clicks = vi.fn();
        document.addEventListener("click", clicks);
        await user.tab();
        expect(document.activeElement.matches("button.button")).toBe(true);
        expect(document.activeElement?.getAttribute("aria-label")).toBe("Save");
        await user.keyboard("{Enter}");
        await user.keyboard(" ");
        document.removeEventListener("click", clicks);
        expect(clicks).toHaveBeenCalledTimes(2);
    });
});
