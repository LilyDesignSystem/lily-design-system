import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./DataTableCol";

function renderInRow(props: Record<string, unknown> = {}) {
    return render(
        <table>
            <thead><tr><Subject {...props} /></tr></thead>
            <tbody><tr><td>cell</td></tr></tbody>
        </table>
    );
}

describe("DataTableCol", () => {
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
        renderInRow({ colSpan: 3 });
        const th = document.querySelector("th");
        expect(th?.getAttribute("colspan")).toBe("3");
    });

    test("has no colspan by default", () => {
        renderInRow();
        const th = document.querySelector("th");
        expect(th?.getAttribute("colspan")).toBeNull();
    });

    test("passes through attributes", () => {
        renderInRow({ "data-testid": "th" });
        const th = document.querySelector("th");
        expect(th?.getAttribute("data-testid")).toBe("th");
    });
});
