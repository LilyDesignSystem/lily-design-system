import { render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./Command";

test("meets the command contract", async () => {
    const { container } = render(() => <Subject label="Actions">{null}</Subject>);
    await runPattern("command", {
        root: container.querySelector<HTMLElement>(".command")!,
        hook: "command",
        act: async (run: () => Promise<void>) => {
            await run();
            flush();
        },
    });
});
