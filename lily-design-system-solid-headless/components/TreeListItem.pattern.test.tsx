import { render } from "@solidjs/testing-library";
import { createSignal, flush } from "solid-js";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./TreeListItem";

test("meets the tree-expand contract", async () => {
    const parent = document.createElement("li");
    parent.setAttribute("role", "treeitem");
    parent.tabIndex = -1;
    document.body.append(parent);
    const [expanded, setExpanded] = createSignal(false);
    render(
        () => (
            <Subject
                label="Branch"
                expanded={expanded()}
                onExpandedChange={setExpanded}
            >
                {null}
            </Subject>
        ),
        { container: parent },
    );
    await runPattern("tree-expand", {
        root: parent.querySelector<HTMLElement>(".tree-list-item")!,
        hook: "tree-list-item",
        act: async (run) => {
            await run();
            flush();
        },
    });
});
