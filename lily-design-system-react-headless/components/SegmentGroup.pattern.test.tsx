import { act, render } from "@testing-library/react";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./SegmentGroup";

test("meets the radio-group contract", async () => {
    const props = { label: "Actions", selectedCount: 0, selectedCountLabel: "None" } as never;
    const { container } = render(<Subject {...(props as object)} />);
    await runPattern("radio-group", {
        root: container.querySelector<HTMLElement>(".segment-group")!,
        hook: "segment-group",
        act: (run) => act(run),
    });
});
