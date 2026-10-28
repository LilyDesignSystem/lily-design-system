import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./DataTable";

const tableContent = (
    <tbody>
        <tr>
            <td>Alice</td>
            <td>alice@example.com</td>
        </tr>
        <tr>
            <td>Bob</td>
            <td>bob@example.com</td>
        </tr>
    </tbody>
);

describe("DataTable", () => {
    test("renders a grid", () => {
        render(<Subject label="Users">{tableContent}</Subject>);
        expect(screen.getByRole("grid")).toBeTruthy();
    });

    test("renders as a table element", () => {
        render(<Subject label="Users">{tableContent}</Subject>);
        expect(screen.getByRole("grid").tagName).toBe("TABLE");
    });

    test("has aria-label", () => {
        render(<Subject label="Accounts">{tableContent}</Subject>);
        expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("Accounts");
    });

    test("renders caption when provided", () => {
        render(
            <Subject
                label="Users"
                caption="User list"
            >
                {tableContent}
            </Subject>,
        );
        const table = screen.getByRole("grid");
        const cap = table.querySelector("caption");
        expect(cap).toBeTruthy();
        expect(cap?.textContent).toBe("User list");
    });

    test("renders without caption by default", () => {
        render(<Subject label="Users">{tableContent}</Subject>);
        const cap = screen.getByRole("grid").querySelector("caption");
        expect(cap).toBeNull();
    });

    test("renders children", () => {
        render(<Subject label="T">{tableContent}</Subject>);
        expect(screen.getByRole("grid").textContent).toContain("Alice");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="T"
                data-testid="dt"
            >
                {tableContent}
            </Subject>,
        );
        expect(screen.getByTestId("dt")).toBeTruthy();
    });
});
