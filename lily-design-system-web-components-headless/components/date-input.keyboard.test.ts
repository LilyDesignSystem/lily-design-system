import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { DateInput } from "./date-input.js";

if (!customElements.get("lily-date-input")) customElements.define("lily-date-input", DateInput);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("DateInput keyboard", () => {
    test("Tab reaches it, by name", async () => {
        document.body.innerHTML = '<lily-date-input label="Name"></lily-date-input>';
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.date-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML = '<lily-date-input label="Name" disabled></lily-date-input>';
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
