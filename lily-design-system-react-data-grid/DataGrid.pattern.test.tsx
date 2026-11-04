import { act, render } from "@testing-library/react";
import { test } from "vitest";

import { gridFixture, runPattern } from "../shared/pattern-tester";
import DataGrid from "./DataGrid";

test("meets the grid contract", async () => {
    const { container } = render(
        <DataGrid
            {...gridFixture}
            label="People"
        />,
    );
    await runPattern("grid", { root: container, hook: "data-grid", act: (run) => act(run) });
});
