import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Table.vue";

describe("Table", () => {
    test("renders a table element", () => {
        render(Subject, { props: { label: "Users" }, slots: { default: "content" } });

        const table = screen.getByRole("table");
        expect(table.tagName).toBe("TABLE");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "User accounts" }, slots: { default: "content" } });

        const table = screen.getByRole("table");
        expect(table.getAttribute("aria-label")).toBe("User accounts");
    });

    test("renders children content", () => {
        render(Subject, { props: { label: "Data" }, slots: { default: "Table data here" } });

        const table = screen.getByRole("table");
        expect(table.textContent).toContain("Table data here");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { label: "Users", "data-testid": "my-table" },
            slots: { default: "content" },
        });

        const table = screen.getByTestId("my-table");
        expect(table).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, {
            props: { label: "Users", id: "users-table" },
            slots: { default: "content" },
        });

        const table = screen.getByRole("table");
        expect(table.getAttribute("id")).toBe("users-table");
    });
});
