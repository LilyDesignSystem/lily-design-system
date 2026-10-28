import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./PaginationNav";

describe("PaginationNav", () => {
    test("renders a navigation landmark", () => {
        render(<Subject label="Pagination">pages</Subject>);
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Pagination">pages</Subject>);
        expect(screen.getByRole("navigation", { name: "Pagination" })).toBeTruthy();
    });

    test("renders as a nav element", () => {
        render(<Subject label="Pagination">pages</Subject>);
        expect(screen.getByRole("navigation").tagName).toBe("NAV");
    });

    test("renders children", () => {
        render(<Subject label="Pagination">Page 1 Page 2</Subject>);
        expect(screen.getByText("Page 1 Page 2")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Pagination"
                data-testid="pn"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("pn")).toBeTruthy();
    });
});
