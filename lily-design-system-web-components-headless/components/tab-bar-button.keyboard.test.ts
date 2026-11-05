import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { afterEach } from "vitest";

import { TabBarButton } from "./tab-bar-button.js";

if (!customElements.get("lily-tab-bar-button"))
    customElements.define("lily-tab-bar-button", TabBarButton);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("TabBarButton keyboard", () => {
    test("Tab reaches the selected tab, and Enter activates it", async () => {
        document.body.innerHTML =
            '<lily-tab-bar-button label="One" selected controls="panel-1">One</lily-tab-bar-button>';
        const user = userEvent.setup();
        const clicks = vi.fn();
        document.addEventListener("click", clicks);
        await user.tab();
        const el = document.activeElement as HTMLElement;
        expect(el.matches("button.tab-bar-button")).toBe(true);
        expect(el.getAttribute("aria-selected")).toBe("true");
        expect(el.getAttribute("aria-controls")).toBe("panel-1");
        await user.keyboard("{Enter}");
        document.removeEventListener("click", clicks);
        expect(clicks).toHaveBeenCalledTimes(1);
    });

    test("Tab skips a tab that is not selected", async () => {
        document.body.innerHTML =
            '<lily-tab-bar-button label="Two" controls="panel-2">One</lily-tab-bar-button>';
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
        expect(document.querySelector(".tab-bar-button")?.getAttribute("aria-selected")).toBe(
            "false",
        );
    });
});
