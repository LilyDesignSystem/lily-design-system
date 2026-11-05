// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "../../test/render.js";

describe("date-input keyboard", () => {
    test("Tab reaches it, by name", async () => {
        document.body.innerHTML = render("date-input", { label: "Name" }).html;
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement;
        expect(el.matches("input.date-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML = render("date-input", { label: "Name", disabled: true }).html;
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
