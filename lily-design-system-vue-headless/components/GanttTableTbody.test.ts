import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./GanttTableBody.vue";


function renderInTable(props: Record<string, unknown>, slotContent?: string) {
    const container = document.createElement("div");
    const table = document.createElement("table");
    container.appendChild(table);
    document.body.appendChild(container);
    const result = render(Subject, { props, ...(slotContent != null ? { slots: { default: slotContent } } : {}), target: table });
    return { ...result, container };
}

describe("GanttTableBody", () => {
    test("renders a tbody element", () => {
        renderInTable({}, "<tr><td>Design</td></tr>");
        const tbody = document.querySelector("tbody");
        expect(tbody).toBeTruthy();
    });

    test("renders children content", () => {
        renderInTable({}, "<tr><td>Jan 1</td></tr>");
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("Jan 1");
    });

    test("passes through attributes", () => {
        renderInTable({ "data-testid": "body" }, "<tr><td>x</td></tr>");
        const tbody = document.querySelector("tbody");
        expect(tbody?.getAttribute("data-testid")).toBe("body");
    });
});
