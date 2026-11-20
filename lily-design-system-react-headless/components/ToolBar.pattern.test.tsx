import { act, render } from "@testing-library/react";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./ToolBar";

test("meets the toolbar contract", async () => {
    const { container } = render(<Subject label="Tools">{null}</Subject>);
    await runPattern("toolbar", {
        root: container.querySelector<HTMLElement>(".tool-bar")!,
        hook: "tool-bar",
        act: (run) => act(run),
    });
});
