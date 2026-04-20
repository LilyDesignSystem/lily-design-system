import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./KanbanTableCol";

function renderInRow(props: Record<string, unknown> = {}) {
    return render(
        <table>
            <thead><tr><Subject {...props} /></tr></thead>
            <tbody><tr><td>cell</td></tr></tbody>
        </table>
    );
}

describe("KanbanTableCol", () => {
    test("renders a th element", () => {
        renderInRow();
        const th = document.querySelector("th");
        expect(th).toBeTruthy();
    });

    test("defaults scope to col", () => {
        renderInRow();
        const th = document.querySelector("th");
        expect(th?.getAttribute("scope")).toBe("col");
    });

    test("supports colSpan attribute", () => {
        renderInRow({ colSpan: 2 });
        const th = document.querySelector("th");
        expect(th?.getAttribute("colspan")).toBe("2");
    });

    test("has no colspan by default", () => {
        renderInRow();
        const th = document.querySelector("th");
        expect(th?.getAttribute("colspan")).toBeNull();
    });

    test("passes through attributes", () => {
        renderInRow({ "data-stage": "todo" });
        const th = document.querySelector("th");
        expect(th?.getAttribute("data-stage")).toBe("todo");
    });
});
