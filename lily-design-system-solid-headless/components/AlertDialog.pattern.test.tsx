import { render } from "@solidjs/testing-library";
import { createSignal, flush } from "solid-js";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./AlertDialog";

test("meets the dialog contract, as an alert dialog", async () => {
    const view = (open: () => boolean) => (
        <Subject
            title="Are you sure?"
            open={open()}
            onChange={(next: boolean) => setOpenState(next)}
        >
            {null}
        </Subject>
    );
    const [openState, setOpenState] = createSignal<boolean>(false);
    const { container } = render(() => view(openState));
    await runPattern("dialog", {
        root: container,
        hook: "alert-dialog",
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
