import { afterEach, describe, expect, test } from "vitest";

import { Table } from "./table.js";

if (!customElements.get("lily-table")) {
    customElements.define("lily-table", Table);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Table", () => {
    test("renders a native table with the base class", () => {
        const host = render('<lily-table label="User accounts"></lily-table>');

        expect(host.querySelector("table")!.className).toBe("table");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-table label="User accounts"></lily-table>');

        expect(host.querySelector("table")!.getAttribute("aria-label")).toBe("User accounts");
    });

    test("moves the consumer's rows into the table", () => {
        // Built via DOM APIs, not innerHTML: the HTML parser's table content
        // model drops a bare <thead>/<tbody>/<tr> whose parent isn't a real
        // <table> (it isn't one yet — <lily-table> hasn't upgraded), so a
        // consumer must build this structure with the DOM APIs rather than
        // parsed markup, exactly as this test does.
        const host = document.createElement("lily-table");
        host.setAttribute("label", "Users");
        const tbody = document.createElement("tbody");
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = "Alice";
        tr.appendChild(td);
        tbody.appendChild(tr);
        host.appendChild(tbody);
        document.body.appendChild(host);

        const table = host.querySelector("table")!;
        expect(table.querySelector("tbody td")!.textContent).toBe("Alice");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-table label="Users" class="compact"></lily-table>');

        expect(host.querySelector("table")!.className).toBe("table compact");
    });

    test("passes rest attributes through onto the table", () => {
        const host = render('<lily-table label="Users" id="users-table"></lily-table>');

        expect(host.querySelector("table")!.id).toBe("users-table");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-table label="Users"></lily-table>');

        (host as unknown as Table).connectedCallback();

        expect(host.querySelectorAll("table").length).toBe(1);
    });
});
