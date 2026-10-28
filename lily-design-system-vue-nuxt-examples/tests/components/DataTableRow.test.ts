import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "../../components/DataTableRow.vue";

function renderInTable(props: Record<string, unknown>, slotContent?: string) {
    const container = document.createElement("div");
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    container.appendChild(table);
    document.body.appendChild(container);
    const result = render(Subject, {
        props,
        ...(slotContent != null ? { slots: { default: slotContent } } : {}),
        target: tbody,
    });
    return { ...result, container };
}

describe("DataTableRow", () => {
    test("renders a tr element", () => {
        renderInTable({}, "<td>Alice</td>");
        const row = document.querySelector("tr");
        expect(row).toBeTruthy();
    });

    test("has implicit row role without explicit role attribute", () => {
        renderInTable({}, "<td>Alice</td>");
        const row = document.querySelector("tr");
        expect(row?.getAttribute("role")).toBeNull();
    });

    test("renders children content", () => {
        renderInTable({}, "<td>Bob</td>");
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("Bob");
    });

    test("renders multiple cells", () => {
        renderInTable({}, "<td>Alice</td><td>alice@example.com</td>");
        const cells = document.querySelectorAll("td");
        expect(cells.length).toBe(2);
        expect(cells[0].textContent).toBe("Alice");
        expect(cells[1].textContent).toBe("alice@example.com");
    });

    test("passes through attributes", () => {
        renderInTable({ "data-testid": "row" }, "<td>x</td>");
        const row = document.querySelector("tr");
        expect(row?.getAttribute("data-testid")).toBe("row");
    });
});
