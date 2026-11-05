// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "../../test/render.js";

describe("password-input keyboard", () => {
    test("Tab reaches it, and typing fills it", async () => {
        document.body.innerHTML = render("password-input", { label: "Name" }).html;
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement;
        expect(el.matches("input.password-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
        await user.keyboard("secret");
        expect(el.value).toBe("secret");
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML = render("password-input", { label: "Name", disabled: true }).html;
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
