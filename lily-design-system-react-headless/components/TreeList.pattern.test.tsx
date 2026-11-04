import { render } from "@testing-library/react";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./TreeList";

test("meets the tree contract", async () => {
    const { container } = render(<Subject label="Sections">{null}</Subject>);
    await runPattern("tree", {
        root: container.querySelector<HTMLElement>(".tree-list")!,
        hook: "tree-list",
    });
});
