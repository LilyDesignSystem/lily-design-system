import { render } from "@testing-library/react";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./CalendarMonthTable";

const ROWS =
    "<tr><th>Alpha</th><th>Beta</th><th>Gamma</th></tr><tr><td>A1</td><td>B1</td><td>C1</td></tr><tr><td>A2</td><td>B2</td><td>C2</td></tr><tr><td>A3</td><td>B3</td><td>C3</td></tr>";

test("meets the grid contract", async () => {
    const { container } = render(
        <Subject label="Grid">
            <tbody dangerouslySetInnerHTML={{ __html: ROWS }} />
        </Subject>,
    );
    await runPattern("grid", {
        root: container.querySelector<HTMLElement>(".calendar-month-table")!,
        hook: "calendar-month-table",
    });
});
