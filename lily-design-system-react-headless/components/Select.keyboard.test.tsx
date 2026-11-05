import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./Select";

describe("Select keyboard", () => {
    test("Tab reaches it, by name", async () => {
        render(
            <Subject label="Colour">
                <option value="a">A</option>
                <option value="b">B</option>
            </Subject>,
        );
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("select.select")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Colour");
    });

    test("Tab skips it when disabled", async () => {
        render(
            <Subject
                label="Colour"
                disabled
            >
                <option value="a">A</option>
                <option value="b">B</option>
            </Subject>,
        );
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
