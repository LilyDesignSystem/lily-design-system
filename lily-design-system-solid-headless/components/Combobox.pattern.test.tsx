import { render } from "@solidjs/testing-library";
import { act } from "./test-act";
import { flush } from "solid-js";
import { createSignal } from "solid-js";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./Combobox";

test("meets the combobox contract", async () => {
    let setOpen: (open: boolean) => void = () => {};
    function Harness() {
        const [open, set] = createSignal(false);
        const [value, setValue] = createSignal("");
        setOpen = set;
        return (
            <Subject
                label="Fruit"
                open={open()}
                onOpenChange={set}
                value={value()}
                onChange={setValue}
            >
                {null}
            </Subject>
        );
    }
    const { container } = render(() => <Harness />);
    await runPattern("combobox", {
        root: container.querySelector<HTMLElement>(".combobox")!,
        hook: "combobox",
        act: async (run: () => Promise<void>) => {
            await run();
            flush();
        },
        open: () => act(() => setOpen(true)),
    });
});
