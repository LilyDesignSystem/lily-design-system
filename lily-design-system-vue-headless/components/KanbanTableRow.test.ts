import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./KanbanTableRow.vue";

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

describe("KanbanTableRow", () => {
    test("renders a tr element", () => {
        renderInTable({}, "<td>Task</td>");
        const row = document.querySelector("tr");
        expect(row).toBeTruthy();
    });

    test("has implicit row role without explicit role attribute", () => {
        renderInTable({}, "<td>Task</td>");
        const row = document.querySelector("tr");
        expect(row?.getAttribute("role")).toBeNull();
    });

    test("renders children content", () => {
        renderInTable({}, "<td>Design review</td>");
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("Design review");
    });

    test("renders multiple cells", () => {
        renderInTable({}, "<td>Task A</td><td>Task B</td><td>Task C</td>");
        expect(document.querySelectorAll("td").length).toBe(3);
    });

    test("passes through attributes", () => {
        renderInTable({ "data-row": "1" }, "<td>x</td>");
        const row = document.querySelector("tr");
        expect(row?.getAttribute("data-row")).toBe("1");
    });
});
