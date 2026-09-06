import { afterEach, describe, expect, test } from "vitest";

import { CalendarTable } from "./calendar-table.js";

if (!customElements.get("lily-calendar-table")) {
    customElements.define("lily-calendar-table", CalendarTable);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CalendarTable", () => {
    test("renders a native table with the base class", () => {
        const host = render('<lily-calendar-table label="January 2025"></lily-calendar-table>');

        expect(host.querySelector("table")!.className).toBe("calendar-table");
    });

    test("has role=grid", () => {
        const host = render('<lily-calendar-table label="January 2025"></lily-calendar-table>');

        expect(host.querySelector("table")!.getAttribute("role")).toBe("grid");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-calendar-table label="January 2025"></lily-calendar-table>');

        expect(host.querySelector("table")!.getAttribute("aria-label")).toBe("January 2025");
    });

    test("moves the consumer's rows into the table", () => {
        // Built via DOM APIs, not innerHTML: the HTML parser's table content
        // model drops a bare <tbody>/<tr> whose parent isn't yet a real
        // <table>, so a consumer must build this structure with the DOM
        // APIs rather than parsed markup, exactly as this test does.
        const host = document.createElement("lily-calendar-table");
        host.setAttribute("label", "January 2025");
        const tbody = document.createElement("tbody");
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = "1";
        tr.appendChild(td);
        tbody.appendChild(tr);
        host.appendChild(tbody);
        document.body.appendChild(host);

        expect(host.querySelector("table tbody td")!.textContent).toBe("1");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-calendar-table label="January 2025" class="compact"></lily-calendar-table>');

        expect(host.querySelector("table")!.className).toBe("calendar-table compact");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-calendar-table label="January 2025"></lily-calendar-table>');

        (host as unknown as CalendarTable).connectedCallback();

        expect(host.querySelectorAll("table").length).toBe(1);
    });
});
