import type React from "react";
import { act, render } from "@testing-library/react";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./TaskBar";

test("meets the toolbar contract", async () => {
    const props = {
        label: "Actions",
        selectedCount: 0,
        selectedCountLabel: "None",
    } as unknown as React.ComponentProps<typeof Subject>;
    const { container } = render(<Subject {...props} />);
    await runPattern("toolbar", {
        root: container.querySelector<HTMLElement>(".task-bar")!,
        hook: "task-bar",
        act: (run) => act(run),
    });
});
