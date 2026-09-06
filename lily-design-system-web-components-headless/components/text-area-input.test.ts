import { afterEach, describe, expect, test } from "vitest";

import { TextAreaInput } from "./text-area-input.js";

if (!customElements.get("lily-text-area-input")) {
    customElements.define("lily-text-area-input", TextAreaInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TextAreaInput", () => {
    test("renders a native textarea", () => {
        const host = render('<lily-text-area-input label="Comments"></lily-text-area-input>');

        expect(host.querySelector("textarea")).toBeTruthy();
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-text-area-input label="Comments"></lily-text-area-input>');

        expect(host.querySelector("textarea")!.getAttribute("aria-label")).toBe("Comments");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render('<lily-text-area-input label="Comments" value="Hello"></lily-text-area-input>');

        expect((host.querySelector("textarea") as HTMLTextAreaElement).value).toBe("Hello");
    });

    test("rows sets the textarea's rows property", () => {
        const host = render('<lily-text-area-input label="Comments" rows="8"></lily-text-area-input>');

        expect((host.querySelector("textarea") as HTMLTextAreaElement).rows).toBe(8);
    });

    test("exposes a live value property proxying the inner textarea", () => {
        const host = render(
            '<lily-text-area-input label="Comments"></lily-text-area-input>',
        ) as unknown as TextAreaInput;
        const textarea = host.querySelector("textarea") as HTMLTextAreaElement;

        host.value = "Updated";

        expect(textarea.value).toBe("Updated");
        expect(host.value).toBe("Updated");
    });

    test("required and disabled propagate to the inner textarea", () => {
        const host = render('<lily-text-area-input label="Comments" required disabled></lily-text-area-input>');

        const textarea = host.querySelector("textarea") as HTMLTextAreaElement;
        expect(textarea.required).toBe(true);
        expect(textarea.disabled).toBe(true);
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-text-area-input label="Comments" class="extra"></lily-text-area-input>');

        expect(host.querySelector("textarea")!.className).toBe("text-area-input extra");
    });
});
