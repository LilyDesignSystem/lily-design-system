import { afterEach, describe, expect, test } from "vitest";

import { ProgressSpinner } from "./progress-spinner.js";

if (!customElements.get("lily-progress-spinner")) {
    customElements.define("lily-progress-spinner", ProgressSpinner);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ProgressSpinner", () => {
    test("carries the base class", () => {
        const host = render('<lily-progress-spinner label="Loading data"></lily-progress-spinner>');

        expect(host.classList.contains("progress-spinner")).toBe(true);
    });

    test("has role=status", () => {
        const host = render('<lily-progress-spinner label="Loading data"></lily-progress-spinner>');

        expect(host.getAttribute("role")).toBe("status");
    });

    test("uses aria-live=polite", () => {
        const host = render('<lily-progress-spinner label="Loading data"></lily-progress-spinner>');

        expect(host.getAttribute("aria-live")).toBe("polite");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-progress-spinner label="Loading data"></lily-progress-spinner>');

        expect(host.getAttribute("aria-label")).toBe("Loading data");
    });

    test("keeps optional inner content in place", () => {
        const host = render('<lily-progress-spinner label="Loading data"><span>Loading...</span></lily-progress-spinner>');

        expect(host.querySelector("span")?.textContent).toBe("Loading...");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render('<lily-progress-spinner label="Loading data" class="my-spinner"></lily-progress-spinner>');

        expect(host.getAttribute("class")).toBe("progress-spinner my-spinner");
    });
});
