import * as React from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import TextSizePicker from "./TextSizePicker";

afterEach(cleanup);

test("meets the picker-listbox contract", async () => {
    const { container } = render(
        <TextSizePicker
            label="Picker"
            sizes={["large", "normal", "small"]}
            defaultValue="large"
        />,
    );
    await runPattern("picker-listbox", {
        root: container.querySelector<HTMLElement>(".text-size-picker")!,
        hook: "text-size-picker",
        settle: () => act(async () => {}),
        press: async (target, key) => {
            fireEvent.keyDown(target, { key });
            await act(async () => {});
        },
    });
});
