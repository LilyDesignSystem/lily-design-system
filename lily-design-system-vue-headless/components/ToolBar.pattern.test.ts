import { render } from "@testing-library/vue";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./ToolBar.vue";

test("meets the toolbar contract", async () => {
    const { container } = render(Subject, { props: { label: "Tools" } });
    await runPattern("toolbar", {
        root: container.querySelector<HTMLElement>(".tool-bar")!,
        hook: "tool-bar",
    });
});
