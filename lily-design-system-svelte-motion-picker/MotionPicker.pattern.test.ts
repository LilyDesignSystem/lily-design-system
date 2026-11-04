import { cleanup, render } from "@testing-library/svelte";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import MotionPicker from "./MotionPicker.svelte";

afterEach(cleanup);

test("meets the picker-listbox contract", async () => {
    const { container } = render(MotionPicker, {
        props: { label: "Picker", motions: ["full", "none", "reduced"], value: "full" },
    });
    await runPattern("picker-listbox", {
        root: container.querySelector<HTMLElement>(".motion-picker")!,
        hook: "motion-picker",
    });
});
