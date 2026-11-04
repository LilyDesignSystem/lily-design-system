import { act, render } from "@testing-library/react";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./SlideOutDrawer";

test("meets the dialog contract", async () => {
    const view = (open: boolean) => (
        <Subject
            label="Settings"
            open={open}
        >
            {null}
        </Subject>
    );
    const { container, rerender } = render(view(false));
    await runPattern("dialog", {
        root: container,
        hook: "slide-out-drawer",
        act: (run) => act(run),
        open: () => {
            rerender(view(false));
            rerender(view(true));
        },
    });
});
