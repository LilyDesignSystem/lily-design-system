import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/DataTable.vue";

describe("DataTable", () => {
    test("renders a grid", () => {
        render(Subject, { props: { label: "Users" }, slots: { default: "<td>Alice</td>" } });
        expect(screen.getByRole("grid")).toBeTruthy();
    });

    test("renders as a table element", () => {
        render(Subject, { props: { label: "Users" }, slots: { default: "<td>Alice</td>" } });
        expect(screen.getByRole("grid").tagName).toBe("TABLE");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Accounts" }, slots: { default: "<td>Alice</td>" } });
        expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("Accounts");
    });

    test("renders caption when provided", () => {
        render(Subject, {
            props: { label: "Users", caption: "User list" },
            slots: { default: "<td>Alice</td>" },
        });
        const table = screen.getByRole("grid");
        const cap = table.querySelector("caption");
        expect(cap).toBeTruthy();
        expect(cap?.textContent).toBe("User list");
    });

    test("renders without caption by default", () => {
        render(Subject, { props: { label: "Users" }, slots: { default: "<td>Alice</td>" } });
        const cap = screen.getByRole("grid").querySelector("caption");
        expect(cap).toBeNull();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "T" }, slots: { default: "<td>Alice</td>" } });
        expect(screen.getByRole("grid").textContent).toContain("Alice");
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "T", "data-testid": "dt" },
            slots: { default: "<td>Alice</td>" },
        });
        expect(screen.getByTestId("dt")).toBeTruthy();
    });
});
