import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./GanttTableThead.vue";


function renderInTable(props: Record<string, unknown>, slotContent?: string) {
    const container = document.createElement("div");
    const table = document.createElement("table");
    container.appendChild(table);
    document.body.appendChild(container);
    const result = render(Subject, { props, ...(slotContent != null ? { slots: { default: slotContent } } : {}), target: table });
    return { ...result, container };
}

describe("GanttTableThead", () => {
    test("renders a thead element", () => {
        renderInTable({}, "<tr><th>Task</th></tr>");
        const thead = document.querySelector("thead");
        expect(thead).toBeTruthy();
    });

    test("renders children content", () => {
        renderInTable({}, "<tr><th>Start</th></tr>");
        const th = document.querySelector("th");
        expect(th?.textContent).toBe("Start");
    });

    test("passes through attributes", () => {
        renderInTable({ "data-testid": "head" }, "<tr><th>x</th></tr>");
        const thead = document.querySelector("thead");
        expect(thead?.getAttribute("data-testid")).toBe("head");
    });
});
