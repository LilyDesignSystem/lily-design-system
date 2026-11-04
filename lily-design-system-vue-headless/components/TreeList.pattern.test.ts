import { render } from "@testing-library/vue";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./TreeList.vue";

test("meets the tree contract", async () => {
    const { container } = render(Subject, { props: { label: "Sections" } });
    await runPattern("tree", {
        root: container.querySelector<HTMLElement>(".tree-list")!,
        hook: "tree-list",
    });
});
