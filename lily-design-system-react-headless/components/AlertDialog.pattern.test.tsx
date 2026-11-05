import { act, render } from "@testing-library/react";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./AlertDialog";

test("meets the dialog contract, as an alert dialog", async () => {
    const view = (open: boolean) => (
        <Subject
            title="Are you sure?"
            open={open}
            onChange={(next: boolean) => rerender(view(next))}
        >
            {null}
        </Subject>
    );
    const { container, rerender } = render(view(false));
    await runPattern("dialog", {
        root: container,
        hook: "alert-dialog",
        act: (run) => act(run),
        open: () => {
            rerender(view(false));
            rerender(view(true));
        },
    });
});
