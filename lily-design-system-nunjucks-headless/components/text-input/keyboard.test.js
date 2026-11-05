// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "../../test/render.js";

describe("text-input keyboard", () => {
    test("Tab reaches it, and typing fills it", async () => {
        document.body.innerHTML = render("text-input", { label: "Name" }).html;
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement;
        expect(el.matches("input.text-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
        await user.keyboard("Ada");
        expect(el.value).toBe("Ada");
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML = render("text-input", { label: "Name", disabled: true }).html;
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
