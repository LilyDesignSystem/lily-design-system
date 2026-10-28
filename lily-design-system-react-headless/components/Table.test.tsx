import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Table";

describe("Table", () => {
    test("renders a table element", () => {
        render(<Subject label="Users">content</Subject>);

        const table = screen.getByRole("table");
        expect(table.tagName).toBe("TABLE");
    });

    test("has aria-label from label prop", () => {
        render(<Subject label="User accounts">content</Subject>);

        const table = screen.getByRole("table");
        expect(table.getAttribute("aria-label")).toBe("User accounts");
    });

    test("renders children content", () => {
        render(<Subject label="Data">Table data here</Subject>);

        const table = screen.getByRole("table");
        expect(table.textContent).toContain("Table data here");
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="Users"
                data-testid="my-table"
            >
                content
            </Subject>,
        );

        const table = screen.getByTestId("my-table");
        expect(table).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(
            <Subject
                label="Users"
                id="users-table"
            >
                content
            </Subject>,
        );

        const table = screen.getByRole("table");
        expect(table.getAttribute("id")).toBe("users-table");
    });
});
