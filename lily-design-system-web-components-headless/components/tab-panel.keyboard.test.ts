import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { TabPanel } from "./tab-panel.js";

if (!customElements.get("lily-tab-panel")) customElements.define("lily-tab-panel", TabPanel);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("TabPanel keyboard", () => {
    test("Tab moves focus into the selected panel", async () => {
        document.body.innerHTML =
            '<lily-tab-panel label="Details" selected>Panel text</lily-tab-panel>';
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLElement;
        expect(el.matches(".tab-panel")).toBe(true);
        expect(el.getAttribute("role")).toBe("tabpanel");
        expect(el.getAttribute("aria-label")).toBe("Details");
    });
});
