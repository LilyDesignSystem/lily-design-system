import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { afterEach } from "vitest";

import { SkipLink } from "./skip-link.js";

if (!customElements.get("lily-skip-link")) customElements.define("lily-skip-link", SkipLink);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("SkipLink keyboard", () => {
    test("Tab reaches it first, and Enter activates it", async () => {
        document.body.innerHTML =
            '<lily-skip-link href="#main" label="Skip to content"></lily-skip-link>';
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
