import { afterEach, describe, expect, test, vi } from "vitest";

import { FileUpload } from "./file-upload.js";

if (!customElements.get("lily-file-upload")) {
    customElements.define("lily-file-upload", FileUpload);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FileUpload", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render('<lily-file-upload label="Upload files"></lily-file-upload>');

        expect(host.className).toBe("file-upload");
    });

    test("renders a button with the label as text and accessible name", () => {
        const host = render('<lily-file-upload label="Upload files"></lily-file-upload>');

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.getAttribute("aria-label")).toBe("Upload files");
        expect(button.textContent).toBe("Upload files");
        expect(button.type).toBe("button");
    });

    test("renders a hidden file input carrying accept/multiple", () => {
        const host = render('<lily-file-upload label="Upload images" accept="image/*" multiple></lily-file-upload>');

        const input = host.querySelector('input[type="file"]') as HTMLInputElement;
        expect(input.hidden).toBe(true);
        expect(input.accept).toBe("image/*");
        expect(input.multiple).toBe(true);
    });

    test("clicking the button triggers the hidden input", () => {
        const host = render('<lily-file-upload label="Upload files"></lily-file-upload>');
        const input = host.querySelector('input[type="file"]') as HTMLInputElement;
        const clickSpy = vi.spyOn(input, "click");

        host.querySelector("button")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expect(clickSpy).toHaveBeenCalled();
    });

    test("the status span starts with data-file-count=0 and no text", () => {
        const host = render('<lily-file-upload label="Upload files"></lily-file-upload>');

        const status = host.querySelector('[aria-live="polite"]') as HTMLElement;
        expect(status.getAttribute("data-file-count")).toBe("0");
        expect(status.textContent).toBe("");
    });

    test("selecting files updates the status span and dispatches lily-change", () => {
        const host = render('<lily-file-upload label="Upload files"></lily-file-upload>');
        const input = host.querySelector('input[type="file"]') as HTMLInputElement;
        const handler = vi.fn();
        host.addEventListener("lily-change", handler);

        const file = new File(["content"], "document.pdf");
        const fileList = {
            0: file,
            length: 1,
            item: (index: number) => (index === 0 ? file : null),
            [Symbol.iterator]: function* () {
                yield file;
            },
        } as unknown as FileList;
        Object.defineProperty(input, "files", { value: fileList, configurable: true });

        input.dispatchEvent(new Event("change", { bubbles: true }));

        const status = host.querySelector('[aria-live="polite"]') as HTMLElement;
        expect(status.getAttribute("data-file-count")).toBe("1");
        expect(status.textContent).toBe("1 file selected");
        expect(handler).toHaveBeenCalledTimes(1);
    });

    test("disabled disables the button", () => {
        const host = render('<lily-file-upload label="Upload files" disabled></lily-file-upload>');

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });
});
