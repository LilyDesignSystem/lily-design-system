import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./TabBarButton";

describe("TabBarButton keyboard", () => {
    test("Tab reaches the selected tab, and Enter activates it", async () => {
        render(
            <Subject
                label="One"
                selected
                controls="panel-1"
            >
                One
            </Subject>,
        );
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
        render(
            <Subject
                label="Two"
                selected={false}
                controls="panel-2"
            >
                One
            </Subject>,
        );
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
        expect(document.querySelector(".tab-bar-button")?.getAttribute("aria-selected")).toBe(
            "false",
        );
    });
});
