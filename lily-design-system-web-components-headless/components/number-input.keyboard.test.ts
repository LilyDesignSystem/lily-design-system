import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { NumberInput } from "./number-input.js";

if (!customElements.get("lily-number-input"))
    customElements.define("lily-number-input", NumberInput);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("NumberInput keyboard", () => {
    test("Tab reaches it, and typing fills it", async () => {
        document.body.innerHTML = '<lily-number-input label="Name"></lily-number-input>';
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.number-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
        await user.keyboard("42");
        expect(el.value).toBe("42");
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML = '<lily-number-input label="Name" disabled></lily-number-input>';
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
