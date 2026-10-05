import { afterEach, describe, expect, test } from "vitest";

import { CalendarYearTable } from "./calendar-year-table.js";

if (!customElements.get("lily-calendar-year-table")) {
    customElements.define("lily-calendar-year-table", CalendarYearTable);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const BASIC = '<lily-calendar-year-table label="2025"></lily-calendar-year-table>';

describe("CalendarYearTable", () => {
    test("renders a native table", () => {
        expect(render(BASIC).querySelector("table")).toBeTruthy();
    });

    test("has role=grid", () => {
        expect(render(BASIC).querySelector("table")!.getAttribute("role")).toBe("grid");
    });

    test("has the calendar-year-table base class", () => {
        expect(render(BASIC).querySelector("table")!.className).toBe("calendar-year-table");
    });

    test("appends the consumer class after the base class", () => {
        const host = render('<lily-calendar-year-table label="x" class="mine"></lily-calendar-year-table>');
        expect(host.querySelector("table")!.className).toBe("calendar-year-table mine");
    });

    test("uses label as aria-label", () => {
        expect(render(BASIC).querySelector("table")!.getAttribute("aria-label")).toBe("2025");
    });

    test("marks the view as data-view=year", () => {
        expect(render(BASIC).querySelector("table")!.getAttribute("data-view")).toBe("year");
    });

    test("renders a caption when provided", () => {
        const host = render('<lily-calendar-year-table label="x" caption="Visible caption"></lily-calendar-year-table>');
        expect(host.querySelector("table > caption")!.textContent).toBe("Visible caption");
    });

    test("renders no caption by default", () => {
        expect(render(BASIC).querySelector("caption")).toBeNull();
    });

    test("moves DOM-built rows into the table", () => {
        const host = document.createElement("lily-calendar-year-table");
        host.setAttribute("label", "x");
        const tbody = document.createElement("tbody");
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = "15";
        tr.appendChild(td);
        tbody.appendChild(tr);
        host.appendChild(tbody);
        document.body.appendChild(host);
        expect(host.querySelector("table tbody td")!.textContent).toBe("15");
    });

    test("passes through other attributes", () => {
        const host = render('<lily-calendar-year-table label="x" data-testid="cal"></lily-calendar-year-table>');
        expect(host.querySelector("table")!.getAttribute("data-testid")).toBe("cal");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render(BASIC);
        (host as unknown as CalendarYearTable).connectedCallback();
        expect(host.querySelectorAll("table").length).toBe(1);
    });
});
