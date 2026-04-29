import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./GanttTableTR.vue";


function renderInTable(props: Record<string, unknown>, slotContent?: string) {
    const container = document.createElement("div");
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    container.appendChild(table);
    document.body.appendChild(container);
    const result = render(Subject, { props, ...(slotContent != null ? { slots: { default: slotContent } } : {}), target: tbody });
    return { ...result, container };
}

describe("GanttTableTR", () => {
    test("renders a tr element", () => {
        renderInTable({}, "<td>Design</td>");
        const row = document.querySelector("tr");
        expect(row).toBeTruthy();
    });

    test("has implicit row role without explicit role attribute", () => {
        renderInTable({}, "<td>Design</td>");
        const row = document.querySelector("tr");
        expect(row).toBeTruthy();
        expect(row?.getAttribute("role")).toBeNull();
    });

    test("renders children content", () => {
        renderInTable({}, "<td>Development</td>");
        const td = document.querySelector("td");
        expect(td).toBeTruthy();
        expect(td?.textContent).toBe("Development");
    });

    test("renders multiple children cells", () => {
        renderInTable({}, "<td>Task</td><td>W1</td><td>W2</td><td>W3</td>");
        const cells = document.querySelectorAll("td");
        expect(cells.length).toBe(4);
        expect(cells[0].textContent).toBe("Task");
        expect(cells[3].textContent).toBe("W3");
    });

    test("passes through attributes", () => {
        renderInTable({ "data-task": "design" }, "<td>x</td>");
        const row = document.querySelector("tr");
        expect(row?.getAttribute("data-task")).toBe("design");
    });
});
