import * as React from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import ThemePicker from "./ThemePicker";

afterEach(cleanup);

test("meets the picker-listbox contract", async () => {
    const { container } = render(
        <ThemePicker
            label="Picker"
            themes={["abyss", "dark", "light"]}
            defaultValue="abyss"
            themesUrl="/t/"
        />,
    );
    await runPattern("picker-listbox", {
        root: container.querySelector<HTMLElement>(".theme-picker")!,
        hook: "theme-picker",
        settle: () => act(async () => {}),
        press: async (target, key) => {
            fireEvent.keyDown(target, { key });
            await act(async () => {});
        },
    });
});
