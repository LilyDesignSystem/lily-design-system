import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./TableTH";

function renderInRow(props: Record<string, unknown> = {}, content: React.ReactNode = "Name") {
    return render(
        <table>
            <thead><tr><Subject {...props}>{content}</Subject></tr></thead>
            <tbody><tr><td>cell</td></tr></tbody>
        </table>
    );
}

describe("TableTH", () => {
    test("renders a th element", () => {
        renderInRow();
        const th = document.querySelector("thead th");
        expect(th).toBeTruthy();
    });

    test("applies class table-th", () => {
        renderInRow();
        const th = document.querySelector("thead th");
        expect(th?.getAttribute("class")).toContain("table-th");
    });

    test("defaults scope to col", () => {
        renderInRow();
        const th = document.querySelector("thead th");
        expect(th?.getAttribute("scope")).toBe("col");
    });

    test("supports custom scope", () => {
        renderInRow({ scope: "row" });
        const th = document.querySelector("thead th");
        expect(th?.getAttribute("scope")).toBe("row");
    });

    test("supports colSpan attribute", () => {
        renderInRow({ colSpan: 3 });
        const th = document.querySelector("thead th");
        expect(th?.getAttribute("colspan")).toBe("3");
    });

    test("has no colspan by default", () => {
        renderInRow();
        const th = document.querySelector("thead th");
        expect(th?.getAttribute("colspan")).toBeNull();
    });

    test("renders children", () => {
        renderInRow({}, "Email");
        const th = document.querySelector("thead th");
        expect(th?.textContent).toBe("Email");
    });

    test("passes through attributes", () => {
        renderInRow({ "data-testid": "th" });
        const th = document.querySelector("thead th");
        expect(th?.getAttribute("data-testid")).toBe("th");
    });
});
