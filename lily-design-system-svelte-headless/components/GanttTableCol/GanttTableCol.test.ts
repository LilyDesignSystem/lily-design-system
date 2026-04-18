import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./GanttTableCol.svelte";

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

describe("GanttTableCol", () => {
    test("renders a col element", () => {
        renderInColgroup({});
        const col = document.querySelector("col");
        expect(col).toBeTruthy();
    });

    test("supports span attribute", () => {
        renderInColgroup({ span: 5 });
        const col = document.querySelector("col");
        expect(col?.getAttribute("span")).toBe("5");
    });

    test("has no span by default", () => {
        renderInColgroup({});
        const col = document.querySelector("col");
        expect(col?.getAttribute("span")).toBeNull();
    });

    test("passes through attributes", () => {
        renderInColgroup({ "data-testid": "col" });
        const col = document.querySelector("col");
        expect(col?.getAttribute("data-testid")).toBe("col");
    });
});
