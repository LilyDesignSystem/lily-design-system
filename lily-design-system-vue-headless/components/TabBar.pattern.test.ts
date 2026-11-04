import { render } from "@testing-library/vue";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./TabBar.vue";

test("meets the tabs contract", async () => {
    const { container } = render(Subject, { props: { label: "Sections" } });
    await runPattern("tabs", {
        root: container.querySelector<HTMLElement>(".tab-bar")!,
        hook: "tab-bar",
    });
});
