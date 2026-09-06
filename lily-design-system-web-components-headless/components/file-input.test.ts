import { afterEach, describe, expect, test } from "vitest";

import { FileInput } from "./file-input.js";

if (!customElements.get("lily-file-input")) {
    customElements.define("lily-file-input", FileInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FileInput", () => {
    test("renders a native input type=file with the base class", () => {
        const host = render('<lily-file-input label="Upload document"></lily-file-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("file");
        expect(input.classList.contains("file-input")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-file-input label="Upload document"></lily-file-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Upload document");
    });

    test("accept attribute propagates to the inner input", () => {
        const host = render('<lily-file-input label="Upload document" accept="image/*"></lily-file-input>');

        expect((host.querySelector("input") as HTMLInputElement).accept).toBe("image/*");
    });

    test("multiple attribute propagates to the inner input", () => {
        const host = render('<lily-file-input label="Upload document" multiple></lily-file-input>');

        expect((host.querySelector("input") as HTMLInputElement).multiple).toBe(true);
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-file-input label="Upload document" required disabled></lily-file-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });
});
