import { act, render } from "@testing-library/react";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./TreeListItem";

test("meets the tree-expand contract", async () => {
    const parent = document.createElement("li");
    parent.setAttribute("role", "treeitem");
    parent.tabIndex = -1;
    document.body.append(parent);
    const view = (expanded: boolean) => (
        <Subject
            label="Branch"
            expanded={expanded}
            onExpandedChange={(value) => rerender(view(value))}
        >
            {null}
        </Subject>
    );
    const { rerender } = render(view(false), { container: parent });
    await runPattern("tree-expand", {
        root: parent.querySelector<HTMLElement>(".tree-list-item")!,
        hook: "tree-list-item",
        act: (run) => act(run),
    });
});
