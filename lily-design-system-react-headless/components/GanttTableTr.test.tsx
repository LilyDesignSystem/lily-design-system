import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./GanttTableTR";

describe("GanttTableTR", () => {
    test("renders a tr element", () => {
        render(<table><tbody><Subject><td>Design</td></Subject></tbody></table>);
        const row = document.querySelector("tr");
        expect(row).toBeTruthy();
    });

    test("has implicit row role without explicit role attribute", () => {
        render(<table><tbody><Subject><td>Design</td></Subject></tbody></table>);
        const row = document.querySelector("tr");
        expect(row).toBeTruthy();
        expect(row?.getAttribute("role")).toBeNull();
    });

    test("renders children content", () => {
        render(<table><tbody><Subject><td>Development</td></Subject></tbody></table>);
        const td = document.querySelector("td");
        expect(td).toBeTruthy();
        expect(td?.textContent).toBe("Development");
    });

    test("renders multiple children cells", () => {
        render(
            <table><tbody><Subject>
                <td>Task</td><td>W1</td><td>W2</td><td>W3</td>
            </Subject></tbody></table>
        );
        const cells = document.querySelectorAll("td");
        expect(cells.length).toBe(4);
        expect(cells[0].textContent).toBe("Task");
        expect(cells[3].textContent).toBe("W3");
    });

    test("passes through attributes", () => {
        render(<table><tbody><Subject data-task="design"><td>x</td></Subject></tbody></table>);
        const row = document.querySelector("tr");
        expect(row?.getAttribute("data-task")).toBe("design");
    });
});
