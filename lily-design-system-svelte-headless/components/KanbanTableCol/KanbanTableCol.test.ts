import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./KanbanTableCol.svelte";

function renderInColgroup(props: Record<string, unknown>) {
    const container = document.createElement("div");
    const table = document.createElement("table");
    const colgroup = document.createElement("colgroup");
    table.appendChild(colgroup);
    container.appendChild(table);
    document.body.appendChild(container);
    const result = render(Subject, { props, target: colgroup });
    return { ...result, container };
}

describe("KanbanTableCol", () => {
    test("renders a col element", () => {
        renderInColgroup({});
        const col = document.querySelector("col");
        expect(col).toBeTruthy();
    });

    test("supports span attribute", () => {
        renderInColgroup({ span: 2 });
        const col = document.querySelector("col");
        expect(col?.getAttribute("span")).toBe("2");
    });

    test("has no span by default", () => {
        renderInColgroup({});
        const col = document.querySelector("col");
        expect(col?.getAttribute("span")).toBeNull();
    });

    test("passes through attributes", () => {
        renderInColgroup({ "data-stage": "todo" });
        const col = document.querySelector("col");
        expect(col?.getAttribute("data-stage")).toBe("todo");
    });
});
