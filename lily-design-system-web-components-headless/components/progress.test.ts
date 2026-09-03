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
        const host = render('<lily-progress label="Upload progress" value="4" max="10"></lily-progress>');

        expect((host.querySelector("progress") as HTMLProgressElement).max).toBe(10);
    });
});
