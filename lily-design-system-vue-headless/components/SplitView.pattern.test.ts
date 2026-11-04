import { render } from "@testing-library/vue";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./SplitView.vue";

test("meets the splitter contract", async () => {
    const { container } = render(Subject, { props: { label: "Panes" } as never });
    await runPattern("splitter", {
        root: container.querySelector<HTMLElement>(".split-view")!,
        hook: "split-view",
    });
});
