import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./TableTH.vue";

function renderInRow(props: Record<string, unknown>) {
    const container = document.createElement("div");
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    thead.appendChild(tr);
    table.appendChild(thead);
    container.appendChild(table);
    document.body.appendChild(container);
    const result = render(Subject, { props, target: tr });
    return { ...result, container };
}

describe("TableTH", () => {
    test("renders a th element", () => {
        renderInRow({});
        const th = document.querySelector("th");
        expect(th).toBeTruthy();
    });

    test("applies class table-th", () => {
        renderInRow({});
        const th = document.querySelector("th");
        expect(th?.getAttribute("class")).toContain("table-th");
    });

    test("defaults scope to col", () => {
        renderInRow({});
        const th = document.querySelector("th");
        expect(th?.getAttribute("scope")).toBe("col");
    });

    test("supports custom scope", () => {
        renderInRow({ scope: "row" });
        const th = document.querySelector("th");
        expect(th?.getAttribute("scope")).toBe("row");
    });

    test("supports colspan attribute", () => {
        renderInRow({ colspan: 3 });
        const th = document.querySelector("th");
        expect(th?.getAttribute("colspan")).toBe("3");
    });

    test("supports rowspan attribute", () => {
        renderInRow({ rowspan: 2 });
        const th = document.querySelector("th");
        expect(th?.getAttribute("rowspan")).toBe("2");
    });

    test("has no colspan by default", () => {
        renderInRow({});
        const th = document.querySelector("th");
        expect(th?.getAttribute("colspan")).toBeNull();
    });
});
