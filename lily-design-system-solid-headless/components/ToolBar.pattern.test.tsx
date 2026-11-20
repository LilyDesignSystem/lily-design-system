import { render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./ToolBar";

test("meets the toolbar contract", async () => {
    const { container } = render(() => <Subject label="Tools">{null}</Subject>);
    await runPattern("toolbar", {
        root: container.querySelector<HTMLElement>(".tool-bar")!,
        hook: "tool-bar",
        act: async (run: () => Promise<void>) => {
            await run();
            flush();
        },
    });
});
