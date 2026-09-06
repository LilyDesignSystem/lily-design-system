import { afterEach, describe, expect, test } from "vitest";

import { ProgressCircle } from "./progress-circle.js";

if (!customElements.get("lily-progress-circle")) {
    customElements.define("lily-progress-circle", ProgressCircle);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ProgressCircle", () => {
    test("carries the base class", () => {
        const host = render('<lily-progress-circle label="Upload"></lily-progress-circle>');

        expect(host.classList.contains("progress-circle")).toBe(true);
    });

    test("has role=progressbar, not the documented but non-existent 'Progress' role", () => {
        const host = render('<lily-progress-circle label="Upload"></lily-progress-circle>');

        expect(host.getAttribute("role")).toBe("progressbar");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-progress-circle label="Upload"></lily-progress-circle>');

        expect(host.getAttribute("aria-label")).toBe("Upload");
    });

    test("defaults aria-valuenow/min/max to 0/0/100", () => {
        const host = render('<lily-progress-circle label="Upload"></lily-progress-circle>');

        expect(host.getAttribute("aria-valuenow")).toBe("0");
        expect(host.getAttribute("aria-valuemin")).toBe("0");
        expect(host.getAttribute("aria-valuemax")).toBe("100");
    });

    test("honours an explicit value/min/max", () => {
        const host = render('<lily-progress-circle label="Upload" value="75" min="0" max="100"></lily-progress-circle>');

        expect(host.getAttribute("aria-valuenow")).toBe("75");
    });

    test("keeps optional inner content (e.g. percentage text) in place", () => {
        const host = render('<lily-progress-circle label="Upload" value="75"><span>75%</span></lily-progress-circle>');

        expect(host.querySelector("span")?.textContent).toBe("75%");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render('<lily-progress-circle label="Upload" class="my-progress"></lily-progress-circle>');

        expect(host.getAttribute("class")).toBe("progress-circle my-progress");
    });
});
