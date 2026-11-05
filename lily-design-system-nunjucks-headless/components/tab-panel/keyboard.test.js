// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "../../test/render.js";

describe("tab-panel keyboard", () => {
    test("Tab moves focus into the selected panel", async () => {
        document.body.innerHTML = render("tab-panel", {
            label: "Details",
            selected: true,
            html: "Panel text",
        }).html;
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement;
        expect(el.matches(".tab-panel")).toBe(true);
        expect(el.getAttribute("role")).toBe("tabpanel");
        expect(el.getAttribute("aria-label")).toBe("Details");
    });
});
