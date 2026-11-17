import { render } from "@solidjs/testing-library";
import type { ComponentProps } from "solid-js";
import { flush } from "solid-js";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./SegmentGroup";

test("meets the radio-group contract", async () => {
    const props = {
        label: "Actions",
        selectedCount: 0,
        selectedCountLabel: "None",
    } as unknown as ComponentProps<typeof Subject>;
    const { container } = render(() => <Subject {...props} />);
    await runPattern("radio-group", {
        root: container.querySelector<HTMLElement>(".segment-group")!,
        hook: "segment-group",
        act: async (run: () => Promise<void>) => {
            await run();
            flush();
        },
    });
});
