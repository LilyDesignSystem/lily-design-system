import { afterEach, describe, expect, test } from "vitest";

import { ProgressBar } from "./progress-bar.js";

if (!customElements.get("lily-progress-bar")) {
    customElements.define("lily-progress-bar", ProgressBar);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ProgressBar", () => {
    test("the host itself carries role=progressbar (self-is-the-wrapper)", () => {
        const host = render('<lily-progress-bar label="Upload progress" value="40"></lily-progress-bar>');

        expect(host.getAttribute("role")).toBe("progressbar");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-progress-bar label="Upload progress" value="40"></lily-progress-bar>');

        expect(host.getAttribute("aria-label")).toBe("Upload progress");
    });

    test("reflects value as aria-valuenow", () => {
        const host = render('<lily-progress-bar label="Upload progress" value="40"></lily-progress-bar>');

        expect(host.getAttribute("aria-valuenow")).toBe("40");
    });

    test("defaults aria-valuemin to 0 and aria-valuemax to 100", () => {
        const host = render('<lily-progress-bar label="Upload progress" value="40"></lily-progress-bar>');

        expect(host.getAttribute("aria-valuemin")).toBe("0");
        expect(host.getAttribute("aria-valuemax")).toBe("100");
    });

    test("honours explicit min and max", () => {
        const host = render('<lily-progress-bar label="Upload progress" value="4" min="1" max="10"></lily-progress-bar>');

        expect(host.getAttribute("aria-valuemin")).toBe("1");
        expect(host.getAttribute("aria-valuemax")).toBe("10");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-progress-bar label="Upload progress" value="40" class="extra"></lily-progress-bar>');

        expect(host.className).toBe("progress-bar extra");
    });
});
