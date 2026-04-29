import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./GanttTableHead";

describe("GanttTableHead", () => {
    test("renders a thead element", () => {
        render(<table><Subject><tr><th>Task</th></tr></Subject></table>);
        const thead = document.querySelector("thead");
        expect(thead).toBeTruthy();
    });

    test("renders children content", () => {
        render(<table><Subject><tr><th>Start</th></tr></Subject></table>);
        const th = document.querySelector("th");
        expect(th?.textContent).toBe("Start");
    });

    test("passes through attributes", () => {
        render(<table><Subject data-testid="head"><tr><th>x</th></tr></Subject></table>);
        const thead = document.querySelector("thead");
        expect(thead?.getAttribute("data-testid")).toBe("head");
    });
});
