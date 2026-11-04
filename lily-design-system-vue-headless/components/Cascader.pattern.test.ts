import { render } from "@testing-library/vue";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./Cascader.vue";

test("meets the tree-popup contract", async () => {
    const { container } = render(Subject, { props: { label: "Choose" } as never });
    await runPattern("tree-popup", {
        root: container.querySelector<HTMLElement>(".cascader")!,
        hook: "cascader",
    });
});
