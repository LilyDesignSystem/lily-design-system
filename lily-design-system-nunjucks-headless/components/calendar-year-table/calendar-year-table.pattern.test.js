// @vitest-environment jsdom
// The shared grid contract against the macro's markup and widget-keys.js.
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { attachGrid } from "../widget-keys.js";

const ROWS =
    "<tbody><tr><th>Alpha</th><th>Beta</th><th>Gamma</th></tr><tr><td>A1</td><td>B1</td><td>C1</td></tr><tr><td>A2</td><td>B2</td><td>C2</td></tr><tr><td>A3</td><td>B3</td><td>C3</td></tr></tbody>";

test("meets the grid contract", async () => {
    document.body.innerHTML = render("calendar-year-table", {
        label: "Grid",
        html: ROWS,
    }).document.body.innerHTML;
    const root = document.querySelector(".calendar-year-table");
    const detach = attachGrid(root);
    await runPattern("grid", { root, hook: "calendar-year-table" });
    detach();
});
