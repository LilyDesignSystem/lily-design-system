import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import Subject from "./KanbanTableTD";

describe("KanbanTableTD", () => {
    test("renders a gridcell", () => {
        render(<table><tbody><tr><Subject /></tr></tbody></table>);
        expect(screen.getByRole("gridcell")).toBeTruthy();
    });

    test("renders as a td element", () => {
        render(<table><tbody><tr><Subject /></tr></tbody></table>);
        expect(screen.getByRole("gridcell").tagName).toBe("TD");
    });

    test("renders children content", () => {
        render(<table><tbody><tr><Subject>Fix login bug</Subject></tr></tbody></table>);
        expect(screen.getByRole("gridcell").textContent).toBe("Fix login bug");
    });

    test("renders empty when no children", () => {
        render(<table><tbody><tr><Subject /></tr></tbody></table>);
        expect(screen.getByRole("gridcell").textContent?.trim()).toBe("");
    });

    test("has aria-selected when active", () => {
        render(<table><tbody><tr><Subject active /></tr></tbody></table>);
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBe("true");
    });

    test("has no aria-selected by default", () => {
        render(<table><tbody><tr><Subject /></tr></tbody></table>);
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBeNull();
    });

    test("has tabindex 0 when active", () => {
        render(<table><tbody><tr><Subject active /></tr></tbody></table>);
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("0");
    });

    test("has tabindex -1 by default", () => {
        render(<table><tbody><tr><Subject /></tr></tbody></table>);
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("-1");
    });

    test("supports aria-label", () => {
        render(<table><tbody><tr><Subject label="Design task" /></tr></tbody></table>);
        expect(screen.getByRole("gridcell").getAttribute("aria-label")).toBe("Design task");
    });

    test("has no aria-label by default", () => {
        render(<table><tbody><tr><Subject /></tr></tbody></table>);
        expect(screen.getByRole("gridcell").getAttribute("aria-label")).toBeNull();
    });

    test("passes through attributes", () => {
        render(<table><tbody><tr><Subject data-testid="cell-1" /></tr></tbody></table>);
        expect(screen.getByTestId("cell-1")).toBeTruthy();
    });
});
