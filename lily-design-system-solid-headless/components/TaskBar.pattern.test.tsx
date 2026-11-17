import { render } from "@solidjs/testing-library";
import type { ComponentProps } from "solid-js";
import { flush } from "solid-js";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./TaskBar";

test("meets the toolbar contract", async () => {
    const props = {
        label: "Actions",
        selectedCount: 0,
        selectedCountLabel: "None",
    } as unknown as ComponentProps<typeof Subject>;
    const { container } = render(() => <Subject {...props} />);
    await runPattern("toolbar", {
        root: container.querySelector<HTMLElement>(".task-bar")!,
        hook: "task-bar",
        act: async (run: () => Promise<void>) => {
            await run();
            flush();
        },
    });
});
