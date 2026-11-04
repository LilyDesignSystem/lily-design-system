import { cleanup, render } from "@testing-library/svelte";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import LocalePicker from "./LocalePicker.svelte";

afterEach(cleanup);

test("meets the picker-listbox contract", async () => {
    const { container } = render(LocalePicker, {
        props: { label: "Picker", locales: ["de", "fr", "it"], value: "de" },
    });
    await runPattern("picker-listbox", {
        root: container.querySelector<HTMLElement>(".locale-picker")!,
        hook: "locale-picker",
    });
});
