import { render } from "@solidjs/testing-library";
import { createSignal, flush } from "solid-js";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./Dialog";

test("meets the dialog contract", async () => {
    const view = (open: () => boolean) => (
        <Subject
            label="Settings"
            open={open()}
        >
            {null}
        </Subject>
    );
    const [openState, setOpenState] = createSignal<boolean>(false);
    const { container } = render(() => view(openState));
    await runPattern("dialog", {
        root: container,
        hook: "dialog",
        act: async (run: () => Promise<void>) => {
            await run();
            flush();
        },
        open: () => {
            setOpenState(false);
            flush();
            setOpenState(true);
            flush();
        },
    });
});
