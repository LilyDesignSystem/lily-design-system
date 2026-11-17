import { render } from "@solidjs/testing-library";
import type { ComponentProps } from "solid-js";
import { flush } from "solid-js";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./Splitter";

test("meets the splitter contract", async () => {
    const props = {
        label: "Panes",
        primary: "One",
        secondary: "Two",
    } as unknown as ComponentProps<typeof Subject>;
    const { container } = render(() => <Subject {...props} />);
    await runPattern("splitter", {
        root: container.querySelector<HTMLElement>(".splitter")!,
        hook: "splitter",
        act: async (run: () => Promise<void>) => {
            await run();
            flush();
        },
    });
});
