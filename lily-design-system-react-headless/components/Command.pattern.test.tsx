import { act, render } from "@testing-library/react";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./Command";

test("meets the command contract", async () => {
    const { container } = render(<Subject label="Actions">{null}</Subject>);
    await runPattern("command", {
        root: container.querySelector<HTMLElement>(".command")!,
        hook: "command",
        act: (run) => act(run),
    });
});
