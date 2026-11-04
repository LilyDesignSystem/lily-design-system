import { act, render } from "@testing-library/react";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./FileDialog";

test("meets the dialog contract", async () => {
    const view = (open: boolean) => (
        <Subject
            label="Settings"
            open={open}
            onChange={(value) => rerender(view(value))}
        >
            {null}
        </Subject>
    );
    const { container, rerender } = render(view(false));
    await runPattern("dialog", {
        root: container,
        hook: "file-dialog",
        act: (run) => act(run),
        open: () => {
            rerender(view(false));
            rerender(view(true));
        },
    });
});
