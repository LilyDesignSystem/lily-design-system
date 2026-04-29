import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/vue";

import Subject from "./CalendarTableTD.vue";


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

describe("CalendarTableTD", () => {
    test("renders a td element", () => {
        renderInRow({}, "15");
        const td = document.querySelector("td");
        expect(td).toBeTruthy();
    });

    test("has role gridcell", () => {
        renderInRow({}, "15");
        expect(screen.getByRole("gridcell")).toBeTruthy();
    });

    test("renders children content", () => {
        renderInRow({}, "20");
        expect(screen.getByText("20")).toBeTruthy();
    });

    test("sets aria-selected when selected", () => {
        renderInRow({ selected: true }, "1");
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBe("true");
    });

    test("omits aria-selected when not selected", () => {
        renderInRow({}, "1");
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBeNull();
    });

    test("sets aria-current date when today", () => {
        renderInRow({ today: true }, "1");
        expect(screen.getByRole("gridcell").getAttribute("aria-current")).toBe("date");
    });

    test("omits aria-current when not today", () => {
        renderInRow({}, "1");
        expect(screen.getByRole("gridcell").getAttribute("aria-current")).toBeNull();
    });

    test("has tabindex 0 when selected", () => {
        renderInRow({ selected: true }, "1");
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("0");
    });

    test("has tabindex -1 when not selected", () => {
        renderInRow({}, "1");
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("-1");
    });

    test("passes through attributes", () => {
        renderInRow({ "data-testid": "day" }, "1");
        expect(screen.getByTestId("day")).toBeTruthy();
    });
});
