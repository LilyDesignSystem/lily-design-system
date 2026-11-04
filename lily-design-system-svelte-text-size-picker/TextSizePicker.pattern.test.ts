import { cleanup, render } from "@testing-library/svelte";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import TextSizePicker from "./TextSizePicker.svelte";

afterEach(cleanup);

test("meets the picker-listbox contract", async () => {
    const { container } = render(TextSizePicker, {
        props: { label: "Picker", sizes: ["large", "normal", "small"], value: "large" },
    });
    await runPattern("picker-listbox", {
        root: container.querySelector<HTMLElement>(".text-size-picker")!,
        hook: "text-size-picker",
    });
});
