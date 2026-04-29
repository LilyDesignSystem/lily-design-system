import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import Subject from "./DataTableTD";

describe("DataTableTD", () => {
    test("renders a td element", () => {
        render(<table><tbody><tr><Subject>Alice</Subject></tr></tbody></table>);
        const td = document.querySelector("td");
        expect(td).toBeTruthy();
    });

    test("has role gridcell", () => {
        render(<table><tbody><tr><Subject>Alice</Subject></tr></tbody></table>);
        expect(screen.getByRole("gridcell")).toBeTruthy();
    });

    test("renders children content", () => {
        render(<table><tbody><tr><Subject>Bob</Subject></tr></tbody></table>);
        expect(screen.getByText("Bob")).toBeTruthy();
    });

    test("has aria-selected when active", () => {
        render(<table><tbody><tr><Subject active>x</Subject></tr></tbody></table>);
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBe("true");
    });

    test("omits aria-selected when not active", () => {
        render(<table><tbody><tr><Subject>x</Subject></tr></tbody></table>);
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBeNull();
    });

    test("has tabindex 0 when active", () => {
        render(<table><tbody><tr><Subject active>x</Subject></tr></tbody></table>);
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("0");
    });

    test("has tabindex -1 when not active", () => {
        render(<table><tbody><tr><Subject>x</Subject></tr></tbody></table>);
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("-1");
    });

    test("defaults to not active", () => {
        render(<table><tbody><tr><Subject>x</Subject></tr></tbody></table>);
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBeNull();
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("-1");
    });

    test("passes through attributes", () => {
        render(<table><tbody><tr><Subject data-testid="cell">x</Subject></tr></tbody></table>);
        expect(screen.getByTestId("cell")).toBeTruthy();
    });
});
