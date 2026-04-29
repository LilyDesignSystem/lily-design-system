import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import Subject from "./CalendarTableTD";

describe("CalendarTableTD", () => {
    test("renders a td element", () => {
        render(<table><tbody><tr><Subject>15</Subject></tr></tbody></table>);
        const td = document.querySelector("td");
        expect(td).toBeTruthy();
    });

    test("has role gridcell", () => {
        render(<table><tbody><tr><Subject>15</Subject></tr></tbody></table>);
        expect(screen.getByRole("gridcell")).toBeTruthy();
    });

    test("renders children content", () => {
        render(<table><tbody><tr><Subject>20</Subject></tr></tbody></table>);
        expect(screen.getByText("20")).toBeTruthy();
    });

    test("sets aria-selected when selected", () => {
        render(<table><tbody><tr><Subject selected>1</Subject></tr></tbody></table>);
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBe("true");
    });

    test("omits aria-selected when not selected", () => {
        render(<table><tbody><tr><Subject>1</Subject></tr></tbody></table>);
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBeNull();
    });

    test("sets aria-current date when today", () => {
        render(<table><tbody><tr><Subject today>1</Subject></tr></tbody></table>);
        expect(screen.getByRole("gridcell").getAttribute("aria-current")).toBe("date");
    });

    test("omits aria-current when not today", () => {
        render(<table><tbody><tr><Subject>1</Subject></tr></tbody></table>);
        expect(screen.getByRole("gridcell").getAttribute("aria-current")).toBeNull();
    });

    test("has tabindex 0 when selected", () => {
        render(<table><tbody><tr><Subject selected>1</Subject></tr></tbody></table>);
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("0");
    });

    test("has tabindex -1 when not selected", () => {
        render(<table><tbody><tr><Subject>1</Subject></tr></tbody></table>);
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("-1");
    });

    test("passes through attributes", () => {
        render(<table><tbody><tr><Subject data-testid="day">1</Subject></tr></tbody></table>);
        expect(screen.getByTestId("day")).toBeTruthy();
    });
});
