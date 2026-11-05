// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "../../test/render.js";

describe("select keyboard", () => {
    test("Tab reaches it, by name", async () => {
        document.body.innerHTML = render("select", {
            label: "Colour",
            html: '<option value="a">A</option><option value="b">B</option>',
        }).html;
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement;
        expect(el.matches("select.select")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Colour");
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML = render("select", {
            label: "Colour",
            disabled: true,
            html: '<option value="a">A</option><option value="b">B</option>',
        }).html;
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
