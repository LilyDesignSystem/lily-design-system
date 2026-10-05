import { afterEach, describe, expect, test } from "vitest";

import { EmptyState } from "./empty-state.js";

if (!customElements.get("lily-empty-state")) {
    customElements.define("lily-empty-state", EmptyState);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EmptyState", () => {
    test("renders with the empty-state class on a div-equivalent root", () => {
        const host = render("<lily-empty-state><p>Nothing</p></lily-empty-state>");
        expect(host.className).toBe("empty-state");
    });

    test("keeps consumer children", () => {
        const host = render("<lily-empty-state><h2>None</h2><button>Add</button></lily-empty-state>");
        expect(host.querySelector("h2")!.textContent).toBe("None");
        expect(host.querySelector("button")).toBeTruthy();
    });

    test("without label there is no role and no aria-label", () => {
        const host = render("<lily-empty-state>x</lily-empty-state>");
        expect(host.hasAttribute("role")).toBe(false);
        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("with label it is a labelled group", () => {
        const host = render('<lily-empty-state label="No projects">x</lily-empty-state>');
        expect(host.getAttribute("role")).toBe("group");
        expect(host.getAttribute("aria-label")).toBe("No projects");
    });

    test("removing the label drops the group role", () => {
        const host = render('<lily-empty-state label="No projects">x</lily-empty-state>');
        host.removeAttribute("label");
        expect(host.hasAttribute("role")).toBe(false);
    });

    test("is not a live region", () => {
        const host = render('<lily-empty-state label="L">x</lily-empty-state>');
        expect(host.hasAttribute("aria-live")).toBe(false);
        expect(host.getAttribute("role")).not.toBe("status");
    });

    test("passes through attributes and consumer class", () => {
        const host = render('<lily-empty-state data-testid="x" class="extra">x</lily-empty-state>');
        expect(host.getAttribute("data-testid")).toBe("x");
        expect(host.className).toBe("empty-state extra");
    });
});
