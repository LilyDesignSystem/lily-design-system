import { afterEach, describe, expect, test } from "vitest";

import { DataFilterForm } from "./data-filter-form.js";

if (!customElements.get("lily-data-filter-form")) {
    customElements.define("lily-data-filter-form", DataFilterForm);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DataFilterForm", () => {
    test("renders a native form with role=search and the base class", () => {
        const host = render('<lily-data-filter-form label="Filter results"></lily-data-filter-form>');

        const form = host.querySelector("form") as HTMLFormElement;
        expect(form.getAttribute("role")).toBe("search");
        expect(form.classList.contains("data-filter-form")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-data-filter-form label="Filter results"></lily-data-filter-form>');

        expect(host.querySelector("form")!.getAttribute("aria-label")).toBe("Filter results");
    });

    test("moves filter controls into the form", () => {
        const host = render(
            '<lily-data-filter-form label="Filter results"><button type="submit">Apply</button></lily-data-filter-form>',
        );

        expect(host.querySelector("form button")!.textContent).toBe("Apply");
    });

    test("prevents the default submit navigation", () => {
        const host = render('<lily-data-filter-form label="Filter results"></lily-data-filter-form>');
        const form = host.querySelector("form") as HTMLFormElement;

        const event = new Event("submit", { bubbles: true, cancelable: true });
        form.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
    });

    test("the submit event still bubbles for the consumer to observe", () => {
        const host = render('<lily-data-filter-form label="Filter results"></lily-data-filter-form>');
        const form = host.querySelector("form") as HTMLFormElement;

        let observed = false;
        host.addEventListener("submit", () => {
            observed = true;
        });
        form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

        expect(observed).toBe(true);
    });
});
