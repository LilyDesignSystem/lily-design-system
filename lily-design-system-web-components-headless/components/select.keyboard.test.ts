import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { Select } from "./select.js";

if (!customElements.get("lily-select")) customElements.define("lily-select", Select);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("Select keyboard", () => {
    test("Tab reaches it, by name", async () => {
        document.body.innerHTML =
            '<lily-select label="Colour"><option value="a">A</option><option value="b">B</option></lily-select>';
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("select.select")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Colour");
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML =
            '<lily-select label="Colour" disabled><option value="a">A</option><option value="b">B</option></lily-select>';
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
