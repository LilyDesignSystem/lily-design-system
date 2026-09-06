import { afterEach, describe, expect, test } from "vitest";

import { DataTable } from "./data-table.js";

if (!customElements.get("lily-data-table")) {
    customElements.define("lily-data-table", DataTable);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DataTable", () => {
    test("renders a native table with the base class", () => {
        const host = render('<lily-data-table label="User accounts"></lily-data-table>');

        expect(host.querySelector("table")!.className).toBe("data-table");
    });

    test("has role=grid", () => {
        const host = render('<lily-data-table label="User accounts"></lily-data-table>');

        expect(host.querySelector("table")!.getAttribute("role")).toBe("grid");
    });

    test("uses label as the accessible name when no caption is present", () => {
        const host = render('<lily-data-table label="User accounts"></lily-data-table>');

        expect(host.querySelector("table")!.getAttribute("aria-label")).toBe("User accounts");
    });

    test("renders a visible caption when provided, and omits aria-label", () => {
        const host = render('<lily-data-table label="User accounts" caption="Quarterly sales"></lily-data-table>');

        const table = host.querySelector("table")!;
        expect(table.querySelector("caption")!.textContent).toBe("Quarterly sales");
        expect(table.hasAttribute("aria-label")).toBe(false);
    });

    test("moves the consumer's rows into the table", () => {
        // Built via DOM APIs, not innerHTML: the HTML parser's table content
        // model drops a bare <tbody>/<tr> whose parent isn't yet a real
        // <table>, so a consumer must build this structure with the DOM
        // APIs rather than parsed markup, exactly as this test does.
        const host = document.createElement("lily-data-table");
        host.setAttribute("label", "Users");
        const tbody = document.createElement("tbody");
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = "Alice";
        tr.appendChild(td);
        tbody.appendChild(tr);
        host.appendChild(tbody);
        document.body.appendChild(host);

        expect(host.querySelector("table tbody td")!.textContent).toBe("Alice");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-data-table label="Users"></lily-data-table>');

        (host as unknown as DataTable).connectedCallback();

        expect(host.querySelectorAll("table").length).toBe(1);
    });
});
