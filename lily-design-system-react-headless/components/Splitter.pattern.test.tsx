import type React from "react";
import { act, render } from "@testing-library/react";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./Splitter";

test("meets the splitter contract", async () => {
    const props = { label: "Panes", primary: "One", secondary: "Two" } as unknown as React.ComponentProps<typeof Subject>;
    const { container } = render(<Subject {...props} />);
    await runPattern("splitter", {
        root: container.querySelector<HTMLElement>(".splitter")!,
        hook: "splitter",
        act: (run) => act(run),
    });
});
