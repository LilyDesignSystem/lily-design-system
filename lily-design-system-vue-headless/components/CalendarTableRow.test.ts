import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./CalendarTableRow.vue";

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

describe("CalendarTableRow", () => {
    test("renders a tr element", () => {
        renderInTable({}, "<td>1</td>");
        const row = document.querySelector("tr");
        expect(row).toBeTruthy();
    });

    test("has implicit row role without explicit role attribute", () => {
        renderInTable({}, "<td>1</td>");
        const row = document.querySelector("tr");
        expect(row?.getAttribute("role")).toBeNull();
    });

    test("renders children content", () => {
        renderInTable({}, "<td>15</td>");
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("15");
    });

    test("renders multiple children cells", () => {
        renderInTable({}, "<td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td>");
        const cells = document.querySelectorAll("td");
        expect(cells.length).toBe(7);
        expect(cells[0].textContent).toBe("1");
        expect(cells[6].textContent).toBe("7");
    });

    test("passes through attributes", () => {
        renderInTable({ "data-testid": "row" }, "<td>1</td>");
        const row = document.querySelector("tr");
        expect(row?.getAttribute("data-testid")).toBe("row");
    });
});
