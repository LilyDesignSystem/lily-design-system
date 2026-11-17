import { render } from "@solidjs/testing-library";
import { createSignal, flush } from "solid-js";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./FileDialog";

test("meets the dialog contract", async () => {
    const view = (open: () => boolean) => (
        <Subject
            label="Settings"
            open={open()}
            onChange={(value: boolean) => setOpenState(value)}
        >
            {null}
        </Subject>
    );
    const [openState, setOpenState] = createSignal<boolean>(false);
    const { container } = render(() => view(openState));
    await runPattern("dialog", {
        root: container,
        hook: "file-dialog",
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
