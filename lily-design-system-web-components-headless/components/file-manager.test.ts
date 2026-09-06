import { afterEach, describe, expect, test } from "vitest";

import { FileManager } from "./file-manager.js";

if (!customElements.get("lily-file-manager")) {
    customElements.define("lily-file-manager", FileManager);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FileManager", () => {
    test("carries the base class and role=region", () => {
        const host = render('<lily-file-manager label="Project files"></lily-file-manager>');

        expect(host.className).toBe("file-manager");
        expect(host.getAttribute("role")).toBe("region");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-file-manager label="Project files"></lily-file-manager>');

        expect(host.getAttribute("aria-label")).toBe("Project files");
    });

    test("preserves children content", () => {
        const host = render('<lily-file-manager label="Project files"><ul><li>document.pdf</li></ul></lily-file-manager>');

        expect(host.querySelector("li")!.textContent).toBe("document.pdf");
    });
});
