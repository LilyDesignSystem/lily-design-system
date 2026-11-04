import { render } from "@testing-library/vue";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./TreeListItem.vue";

test("meets the tree-expand contract", async () => {
    const parent = document.createElement("li");
    parent.setAttribute("role", "treeitem");
    parent.tabIndex = -1;
    document.body.append(parent);
    const { rerender } = render(Subject, {
        container: parent,
        props: {
            label: "Branch",
            expanded: false,
            "onUpdate:expanded": (expanded: boolean) => rerender({ expanded }),
        },
    });
    await runPattern("tree-expand", {
        root: parent.querySelector<HTMLElement>(".tree-list-item")!,
        hook: "tree-list-item",
    });
});
