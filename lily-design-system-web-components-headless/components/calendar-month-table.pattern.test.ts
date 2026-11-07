import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { CalendarMonthTable } from "./calendar-month-table.js";

if (!customElements.get("lily-calendar-month-table"))
    customElements.define("lily-calendar-month-table", CalendarMonthTable);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the grid contract", async () => {
    document.body.innerHTML =
        '<lily-calendar-month-table label="Grid"></lily-calendar-month-table>';
    const host = document.body.firstElementChild as HTMLElement;
    // A table's rows reach this element by DOM calls, after it has connected: see its header.
    host.querySelector("table")!.innerHTML =
        "<tbody><tr><th>Alpha</th><th>Beta</th><th>Gamma</th></tr><tr><td>A1</td><td>B1</td><td>C1</td></tr><tr><td>A2</td><td>B2</td><td>C2</td></tr><tr><td>A3</td><td>B3</td><td>C3</td></tr></tbody>";
    await new Promise((resolve) => setTimeout(resolve));
    await runPattern("grid", { root: host, hook: "calendar-month-table" });
});
