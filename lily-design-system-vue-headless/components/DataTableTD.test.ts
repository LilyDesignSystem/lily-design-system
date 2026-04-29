import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/vue";

import Subject from "./DataTableTD.vue";


function renderInRow(props: Record<string, unknown>, slotContent?: string) {
    const container = document.createElement("div");
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    const tr = document.createElement("tr");
    tbody.appendChild(tr);
    table.appendChild(tbody);
    container.appendChild(table);
    document.body.appendChild(container);
    const result = render(Subject, { props, ...(slotContent != null ? { slots: { default: slotContent } } : {}), target: tr });
    return { ...result, container };
}

describe("DataTableTD", () => {
    test("renders a td element", () => {
        renderInRow({}, "Alice");
        const td = document.querySelector("td");
        expect(td).toBeTruthy();
    });

    test("has role gridcell", () => {
        renderInRow({}, "Alice");
        expect(screen.getByRole("gridcell")).toBeTruthy();
    });

    test("renders children content", () => {
        renderInRow({}, "Bob");
        expect(screen.getByText("Bob")).toBeTruthy();
    });

    test("has aria-selected when active", () => {
        renderInRow({ active: true }, "x");
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBe("true");
    });

    test("omits aria-selected when not active", () => {
        renderInRow({}, "x");
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBeNull();
    });

    test("has tabindex 0 when active", () => {
        renderInRow({ active: true }, "x");
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("0");
    });

    test("has tabindex -1 when not active", () => {
        renderInRow({}, "x");
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("-1");
    });

    test("defaults to not active", () => {
        renderInRow({}, "x");
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBeNull();
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("-1");
    });

    test("passes through attributes", () => {
        renderInRow({ "data-testid": "cell" }, "x");
        expect(screen.getByTestId("cell")).toBeTruthy();
    });
});
