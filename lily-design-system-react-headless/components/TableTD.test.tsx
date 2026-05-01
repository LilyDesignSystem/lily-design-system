import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./TableTD";

function renderInRow(props: Record<string, unknown> = {}, content: React.ReactNode = "cell") {
    return render(
        <table>
            <tbody><tr><Subject {...props}>{content}</Subject></tr></tbody>
        </table>
    );
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

    test("supports colSpan attribute", () => {
        renderInRow({ colSpan: 2 });
        const td = document.querySelector("td");
        expect(td?.getAttribute("colspan")).toBe("2");
    });

    test("supports rowSpan attribute", () => {
        renderInRow({ rowSpan: 2 });
        const td = document.querySelector("td");
        expect(td?.getAttribute("rowspan")).toBe("2");
    });

    test("has no colspan/rowspan by default", () => {
        renderInRow();
        const td = document.querySelector("td");
        expect(td?.getAttribute("colspan")).toBeNull();
        expect(td?.getAttribute("rowspan")).toBeNull();
    });

    test("renders children", () => {
        renderInRow({}, "Alice");
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("Alice");
    });

    test("passes through attributes", () => {
        renderInRow({ "data-testid": "td" });
        const td = document.querySelector("td");
        expect(td?.getAttribute("data-testid")).toBe("td");
    });
});
