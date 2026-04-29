import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./GanttTableTfoot";

describe("GanttTableTfoot", () => {
    test("renders a tfoot element", () => {
        render(<table><Subject><tr><td>Total: 12</td></tr></Subject></table>);
        const tfoot = document.querySelector("tfoot");
        expect(tfoot).toBeTruthy();
    });

    test("renders children content", () => {
        render(<table><Subject><tr><td>Total: 12 tasks</td></tr></Subject></table>);
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("Total: 12 tasks");
    });

    test("passes through attributes", () => {
        render(<table><Subject data-testid="foot"><tr><td>x</td></tr></Subject></table>);
        const tfoot = document.querySelector("tfoot");
        expect(tfoot?.getAttribute("data-testid")).toBe("foot");
    });
});
