import { afterEach, describe, expect, test } from "vitest";

import { Progress } from "./progress.js";

if (!customElements.get("lily-progress")) {
    customElements.define("lily-progress", Progress);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Progress", () => {
    test("renders a native progress element", () => {
        const host = render('<lily-progress label="Upload progress"></lily-progress>');

        expect(host.querySelector("progress")).toBeTruthy();
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-progress label="Upload progress"></lily-progress>');

        expect(host.querySelector("progress")!.getAttribute("aria-label")).toBe("Upload progress");
    });

    test("is indeterminate when value is absent", () => {
        const host = render('<lily-progress label="Upload progress"></lily-progress>');

        const progress = host.querySelector("progress") as HTMLProgressElement;
        expect(progress.hasAttribute("value")).toBe(false);
    });

    test("is determinate when value is given", () => {
        const host = render('<lily-progress label="Upload progress" value="40"></lily-progress>');

        expect((host.querySelector("progress") as HTMLProgressElement).value).toBe(40);
    });

    test("defaults max to 100", () => {
        const host = render('<lily-progress label="Upload progress" value="40"></lily-progress>');

        expect((host.querySelector("progress") as HTMLProgressElement).max).toBe(100);
    });

    test("honours an explicit max", () => {
        const host = render(
            '<lily-progress label="Upload progress" value="4" max="10"></lily-progress>',
        );

        expect((host.querySelector("progress") as HTMLProgressElement).max).toBe(10);
    });

    test("shows a change to its attributes after it is mounted (P50-T28)", async () => {
        document.body.innerHTML = `<lily-progress label="Upload" value="20"></lily-progress>`;
        const el = document.querySelector("lily-progress")!;
        const span = el.querySelector("progress.progress")!;
        el.setAttribute("value", "60");
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(el.querySelector("progress.progress")).toBe(span);
        expect((span as HTMLProgressElement).value).toBe(60);
        el.removeAttribute("value");
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(span.hasAttribute("value")).toBe(false);
    });
});
