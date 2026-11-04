import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { gridActionsFixture, gridFixture, runPattern } from "../shared/pattern-tester";
import Subject from "./DataGrid.svelte";

test("meets the grid contract", async () => {
    const { container } = render(Subject, {
        props: { ...gridFixture, label: "People" },
    });
    await runPattern("grid", { root: container as HTMLElement, hook: "data-grid" });
});

test("meets the grid-actions contract", async () => {
    const { container } = render(Subject, {
        props: { ...gridActionsFixture, label: "People" } as never,
    });
    await runPattern("grid-actions", { root: container as HTMLElement, hook: "data-grid" });
});
