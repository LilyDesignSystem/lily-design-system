import { render } from "@testing-library/vue";
import { test } from "vitest";

import { gridFixture, runPattern } from "../shared/pattern-tester";
import DataGrid from "./DataGrid.vue";

test("meets the grid contract", async () => {
    const { container } = render(DataGrid, { props: { ...gridFixture, label: "People" } });
    await runPattern("grid", { root: container as HTMLElement, hook: "data-grid" });
});
