import { render } from "@solidjs/testing-library";
import type { ComponentProps } from "solid-js";
import { flush } from "solid-js";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./ActionBar";

test("meets the toolbar contract", async () => {
    const props = {
        label: "Actions",
        selectedCount: 0,
        selectedCountLabel: "None",
    } as unknown as ComponentProps<typeof Subject>;
    const { container } = render(() => <Subject {...props} />);
    await runPattern("toolbar", {
        root: container.querySelector<HTMLElement>(".action-bar")!,
        hook: "action-bar",
        act: async (run: () => Promise<void>) => {
            await run();
            flush();
        },
    });
});
