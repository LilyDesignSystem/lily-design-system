import { cleanup, render } from "@testing-library/svelte";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import ThemePicker from "./ThemePicker.svelte";

afterEach(cleanup);

test("meets the picker-listbox contract", async () => {
    const { container } = render(ThemePicker, {
        props: {
            label: "Picker",
            themes: ["abyss", "dark", "light"],
            value: "abyss",
            themesUrl: "/t/",
        },
    });
    await runPattern("picker-listbox", {
        root: container.querySelector<HTMLElement>(".theme-picker")!,
        hook: "theme-picker",
    });
});
