import { afterEach, describe, expect, test } from "vitest";

import { GanttTable } from "./gantt-table.js";

if (!customElements.get("lily-gantt-table")) {
    customElements.define("lily-gantt-table", GanttTable);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("GanttTable", () => {
    test("renders a native table with the base class", () => {
        const host = render('<lily-gantt-table label="Project timeline"></lily-gantt-table>');

        expect(host.querySelector("table")!.className).toBe("gantt-table");
    });

    test("has role=grid", () => {
        const host = render('<lily-gantt-table label="Project timeline"></lily-gantt-table>');

        expect(host.querySelector("table")!.getAttribute("role")).toBe("grid");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-gantt-table label="Project timeline"></lily-gantt-table>');

        expect(host.querySelector("table")!.getAttribute("aria-label")).toBe("Project timeline");
    });

    test("moves the consumer's rows into the table", () => {
        // Built via DOM APIs, not innerHTML: the HTML parser's table content
        // model drops a bare <tbody>/<tr> whose parent isn't yet a real
        // <table>, so a consumer must build this structure with the DOM
        // APIs rather than parsed markup, exactly as this test does.
        const host = document.createElement("lily-gantt-table");
        host.setAttribute("label", "Project timeline");
        const tbody = document.createElement("tbody");
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = "Design";
        tr.appendChild(td);
        tbody.appendChild(tr);
        host.appendChild(tbody);
        document.body.appendChild(host);

        expect(host.querySelector("table tbody td")!.textContent).toBe("Design");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-gantt-table label="Project timeline" class="compact"></lily-gantt-table>');

        expect(host.querySelector("table")!.className).toBe("gantt-table compact");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-gantt-table label="Project timeline"></lily-gantt-table>');

        (host as unknown as GanttTable).connectedCallback();

        expect(host.querySelectorAll("table").length).toBe(1);
    });
});
