import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { TextAreaInput } from "./text-area-input.js";

if (!customElements.get("lily-text-area-input"))
    customElements.define("lily-text-area-input", TextAreaInput);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("TextAreaInput keyboard", () => {
    test("Tab reaches it, and typing fills it", async () => {
        document.body.innerHTML = '<lily-text-area-input label="Name"></lily-text-area-input>';
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("textarea.text-area-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
        await user.keyboard("Ada");
        expect(el.value).toBe("Ada");
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML =
            '<lily-text-area-input label="Name" disabled></lily-text-area-input>';
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
