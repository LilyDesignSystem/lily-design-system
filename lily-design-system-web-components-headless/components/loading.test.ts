import { afterEach, describe, expect, test } from "vitest";

import { Loading } from "./loading.js";

if (!customElements.get("lily-loading")) {
    customElements.define("lily-loading", Loading);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Loading", () => {
    test("renders as itself with the base class", () => {
        const host = render("<lily-loading></lily-loading>");

        expect(host.tagName.toLowerCase()).toBe("lily-loading");
        expect(host.className).toBe("loading");
    });

    test("has role=status and aria-live=polite", () => {
        const host = render("<lily-loading></lily-loading>");

        expect(host.getAttribute("role")).toBe("status");
        expect(host.getAttribute("aria-live")).toBe("polite");
    });

    test("defaults the accessible name to Loading", () => {
        const host = render("<lily-loading></lily-loading>");

        expect(host.getAttribute("aria-label")).toBe("Loading");
    });

    test("uses a custom label when provided", () => {
        const host = render('<lily-loading label="Uploading file"></lily-loading>');

        expect(host.getAttribute("aria-label")).toBe("Uploading file");
    });

    test("updates aria-label reactively when the label attribute changes", () => {
        const host = render("<lily-loading></lily-loading>");

        host.setAttribute("label", "Fetching results");
        expect(host.getAttribute("aria-label")).toBe("Fetching results");
    });

    test("preserves children content in place", () => {
        const host = render("<lily-loading><span>Loading dashboard...</span></lily-loading>");

        expect(host.querySelector("span")!.textContent).toBe("Loading dashboard...");
    });

    test("appends the consumer's class hook to the base class", () => {
        const host = render('<lily-loading class="overlay"></lily-loading>');

        expect(host.className).toBe("loading overlay");
    });
});
