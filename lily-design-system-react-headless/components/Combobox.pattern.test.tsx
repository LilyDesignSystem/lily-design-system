import { act, render } from "@testing-library/react";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./Combobox";

test("meets the combobox contract", async () => {
    const view = (open: boolean) => (
        <Subject
            label="Fruit"
            open={open}
            onOpenChange={(value) => rerender(view(value))}
        >
            {null}
        </Subject>
    );
    const { container, rerender } = render(view(false));
    await runPattern("combobox", {
        root: container.querySelector<HTMLElement>(".combobox")!,
        hook: "combobox",
        act: (run) => act(run),
        open: () => rerender(view(true)),
    });
});
