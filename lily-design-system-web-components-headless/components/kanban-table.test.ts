import { afterEach, describe, expect, test } from "vitest";

import { KanbanTable } from "./kanban-table.js";

if (!customElements.get("lily-kanban-table")) {
    customElements.define("lily-kanban-table", KanbanTable);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("KanbanTable", () => {
    test("renders a native table with the base class", () => {
        const host = render('<lily-kanban-table label="Sprint 5 board"></lily-kanban-table>');

        expect(host.querySelector("table")!.className).toBe("kanban-table");
    });

    test("has role=region (per the canonical acceptance criteria)", () => {
        const host = render('<lily-kanban-table label="Sprint 5 board"></lily-kanban-table>');

        expect(host.querySelector("table")!.getAttribute("role")).toBe("region");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-kanban-table label="Sprint 5 board"></lily-kanban-table>');

        expect(host.querySelector("table")!.getAttribute("aria-label")).toBe("Sprint 5 board");
    });

    test("moves the consumer's rows into the table", () => {
        // Built via DOM APIs, not innerHTML: the HTML parser's table content
        // model drops a bare <tbody>/<tr> whose parent isn't yet a real
        // <table>, so a consumer must build this structure with the DOM
        // APIs rather than parsed markup, exactly as this test does.
        const host = document.createElement("lily-kanban-table");
        host.setAttribute("label", "Sprint 5 board");
        const tbody = document.createElement("tbody");
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = "Task A";
        tr.appendChild(td);
        tbody.appendChild(tr);
        host.appendChild(tbody);
        document.body.appendChild(host);

        expect(host.querySelector("table tbody td")!.textContent).toBe("Task A");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-kanban-table label="Sprint 5 board"></lily-kanban-table>');

        (host as unknown as KanbanTable).connectedCallback();

        expect(host.querySelectorAll("table").length).toBe(1);
    });
});
