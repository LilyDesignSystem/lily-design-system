// The shared grid contract against the shipped snippet.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

it("meets the grid contract", async () => {
    await mount("kanban-table");
    const root = document.querySelector(".kanban-table");
    root.setAttribute("aria-label", "Board");
    root.innerHTML = "<tbody><tr><th>Alpha</th><th>Beta</th><th>Gamma</th></tr><tr><td>A1</td><td>B1</td><td>C1</td></tr><tr><td>A2</td><td>B2</td><td>C2</td></tr><tr><td>A3</td><td>B3</td><td>C3</td></tr></tbody>";
    await new Promise((resolve) => setTimeout(resolve));
    await runPattern("grid", { root, hook: "kanban-table", settle: tick });
});
