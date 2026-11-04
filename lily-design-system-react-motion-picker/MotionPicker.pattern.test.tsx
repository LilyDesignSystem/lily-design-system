import * as React from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import MotionPicker from "./MotionPicker";

afterEach(cleanup);

test("meets the picker-listbox contract", async () => {
    const { container } = render(
        <MotionPicker
            label="Picker"
            motions={["full", "none", "reduced"]}
            defaultValue="full"
        />,
    );
    await runPattern("picker-listbox", {
        root: container.querySelector<HTMLElement>(".motion-picker")!,
        hook: "motion-picker",
        settle: () => act(async () => {}),
        press: async (target, key) => {
            fireEvent.keyDown(target, { key });
            await act(async () => {});
        },
    });
});
