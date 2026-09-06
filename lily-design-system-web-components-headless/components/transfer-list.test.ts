import { afterEach, describe, expect, test } from "vitest";

import { TransferList } from "./transfer-list.js";

if (!customElements.get("lily-transfer-list")) {
    customElements.define("lily-transfer-list", TransferList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TransferList", () => {
    test("carries the base class and role=group with aria-label", () => {
        const host = render(
            '<lily-transfer-list label="Assign roles" source-label="Available" target-label="Selected"></lily-transfer-list>',
        );

        expect(host.classList.contains("transfer-list")).toBe(true);
        expect(host.getAttribute("role")).toBe("group");
        expect(host.getAttribute("aria-label")).toBe("Assign roles");
    });

    test("renders source content inside .transfer-list-source with aria-label", () => {
        const host = render(
            '<lily-transfer-list label="Assign roles" source-label="Available roles" target-label="Selected roles">' +
                '<ul role="listbox" slot="source"><li>Admin</li></ul>' +
                '<ul role="listbox" slot="target"></ul>' +
                "</lily-transfer-list>",
        );

        const source = host.querySelector(".transfer-list-source") as HTMLElement;
        expect(source.tagName).toBe("SECTION");
        expect(source.getAttribute("aria-label")).toBe("Available roles");
        expect(source.querySelector("li")?.textContent).toBe("Admin");
    });

    test("renders target content inside .transfer-list-target with aria-label", () => {
        const host = render(
            '<lily-transfer-list label="Assign roles" source-label="Available roles" target-label="Selected roles">' +
                '<ul role="listbox" slot="source"></ul>' +
                '<ul role="listbox" slot="target"><li>Editor</li></ul>' +
                "</lily-transfer-list>",
        );

        const target = host.querySelector(".transfer-list-target") as HTMLElement;
        expect(target.getAttribute("aria-label")).toBe("Selected roles");
        expect(target.querySelector("li")?.textContent).toBe("Editor");
    });

    test("renders actions content inside .transfer-list-actions only when provided", () => {
        const withActions = render(
            '<lily-transfer-list label="Assign roles" source-label="Available" target-label="Selected">' +
                '<ul slot="source"></ul>' +
                '<div slot="actions"><button type="button">→</button></div>' +
                '<ul slot="target"></ul>' +
                "</lily-transfer-list>",
        );
        expect(withActions.querySelector(".transfer-list-actions button")).toBeTruthy();

        document.body.innerHTML = "";

        const withoutActions = render(
            '<lily-transfer-list label="Assign roles" source-label="Available" target-label="Selected">' +
                '<ul slot="source"></ul>' +
                '<ul slot="target"></ul>' +
                "</lily-transfer-list>",
        );
        expect(withoutActions.querySelector(".transfer-list-actions")).toBeNull();
    });

    test("preserves DOM order: source, actions, target", () => {
        const host = render(
            '<lily-transfer-list label="Assign roles" source-label="Available" target-label="Selected">' +
                '<ul slot="source"></ul>' +
                '<div slot="actions"></div>' +
                '<ul slot="target"></ul>' +
                "</lily-transfer-list>",
        );

        const classes = Array.from(host.children).map((el) => el.className);
        expect(classes).toEqual(["transfer-list-source", "transfer-list-actions", "transfer-list-target"]);
    });
});
