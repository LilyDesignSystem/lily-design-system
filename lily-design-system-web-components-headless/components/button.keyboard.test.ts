import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { afterEach } from "vitest";

import { Button } from "./button.js";

if (!customElements.get("lily-button")) customElements.define("lily-button", Button);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("Button keyboard", () => {
    test("Tab reaches it, and Enter and Space activate it", async () => {
        document.body.innerHTML = '<lily-button label="Save">Save</lily-button>';
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
