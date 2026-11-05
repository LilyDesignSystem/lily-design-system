import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import { useState } from "react";

import Subject from "./NumberInput";

function Harness() {
    const [value, setValue] = useState<number | undefined>(undefined);
    return (
        <Subject
            label="Name"
            value={value}
            onChange={setValue}
        />
    );
}

describe("NumberInput keyboard", () => {
    test("Tab reaches it, and typing fills it", async () => {
        render(<Harness />);
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.number-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
        await user.keyboard("42");
        expect(el.value).toBe("42");
    });

    test("Tab skips it when disabled", async () => {
        render(
            <Subject
                label="Name"
                disabled
            />,
        );
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
