import { render } from "@testing-library/vue";
import { test } from "vitest";
import { h } from "vue";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./CalendarMonthTable.vue";

const ROWS =
    "<tr><th>Alpha</th><th>Beta</th><th>Gamma</th></tr><tr><td>A1</td><td>B1</td><td>C1</td></tr><tr><td>A2</td><td>B2</td><td>C2</td></tr><tr><td>A3</td><td>B3</td><td>C3</td></tr>";

test("meets the grid contract", async () => {
    const { container } = render(Subject, {
        props: { label: "Grid" } as never,
        slots: { default: () => h("tbody", { innerHTML: ROWS }) },
    });
    await runPattern("grid", {
        root: container.querySelector<HTMLElement>(".calendar-month-table")!,
        hook: "calendar-month-table",
    });
});
