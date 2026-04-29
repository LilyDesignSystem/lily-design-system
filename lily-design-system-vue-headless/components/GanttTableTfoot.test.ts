import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./GanttTableTfoot.vue";


function renderInTable(props: Record<string, unknown>, slotContent?: string) {
    const container = document.createElement("div");
    const table = document.createElement("table");
    container.appendChild(table);
    document.body.appendChild(container);
    const result = render(Subject, { props, ...(slotContent != null ? { slots: { default: slotContent } } : {}), target: table });
    return { ...result, container };
}

describe("GanttTableTfoot", () => {
    test("renders a tfoot element", () => {
        renderInTable({}, "<tr><td>Total: 12</td></tr>");
        const tfoot = document.querySelector("tfoot");
        expect(tfoot).toBeTruthy();
    });

    test("renders children content", () => {
        renderInTable({}, "<tr><td>Total: 12 tasks</td></tr>");
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("Total: 12 tasks");
    });

    test("passes through attributes", () => {
        renderInTable({ "data-testid": "foot" }, "<tr><td>x</td></tr>");
        const tfoot = document.querySelector("tfoot");
        expect(tfoot?.getAttribute("data-testid")).toBe("foot");
    });
});
