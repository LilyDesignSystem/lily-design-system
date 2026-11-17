import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";

import Subject from "./TextInput";

function Harness() {
    const [value, setValue] = createSignal("");
    return (
        <Subject
            label="Name"
            value={value()}
            onChange={setValue}
        />
    );
}

describe("TextInput keyboard", () => {
    test("Tab reaches it, and typing fills it", async () => {
        render(() => <Harness />);
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.text-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
        await user.keyboard("Ada");
        expect(el.value).toBe("Ada");
    });

    test("Tab skips it when disabled", async () => {
        render(() => (
            <Subject
                label="Name"
                disabled
            />
        ));
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
