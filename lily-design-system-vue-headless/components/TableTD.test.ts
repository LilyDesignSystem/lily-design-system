import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./TableTD.vue";

function renderInRow(props: Record<string, unknown> = {}, slotContent: string = "cell") {
    const container = document.createElement("div");
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    const tr = document.createElement("tr");
    tbody.appendChild(tr);
    table.appendChild(tbody);
    container.appendChild(table);
    document.body.appendChild(container);
    const result = render(Subject, { props, slots: { default: slotContent }, target: tr });
    return { ...result, container };
}

describe("TableTD", () => {
    test("renders a td element", () => {
        renderInRow();
        const td = document.querySelector("td");
        expect(td).toBeTruthy();
    });

    test("applies class table-td", () => {
        renderInRow();
        const td = document.querySelector("td");
        expect(td?.getAttribute("class")).toContain("table-td");
    });

    test("supports colspan attribute", () => {
        renderInRow({ colspan: 2 });
        const td = document.querySelector("td");
        expect(td?.getAttribute("colspan")).toBe("2");
    });

    test("supports rowspan attribute", () => {
        renderInRow({ rowspan: 2 });
        const td = document.querySelector("td");
        expect(td?.getAttribute("rowspan")).toBe("2");
    });

    test("has no colspan/rowspan by default", () => {
        renderInRow();
        const td = document.querySelector("td");
        expect(td?.getAttribute("colspan")).toBeNull();
        expect(td?.getAttribute("rowspan")).toBeNull();
    });

    test("renders slot content", () => {
        renderInRow({}, "Alice");
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("Alice");
    });
});
