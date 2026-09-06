import { afterEach, describe, expect, test } from "vitest";

import { TextAreaInputWithCharacterCounter } from "./text-area-input-with-character-counter.js";

if (!customElements.get("lily-text-area-input-with-character-counter")) {
    customElements.define("lily-text-area-input-with-character-counter", TextAreaInputWithCharacterCounter);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TextAreaInputWithCharacterCounter", () => {
    test("carries the base class on the host", () => {
        const host = render(
            '<lily-text-area-input-with-character-counter label="Feedback" max-length="500"></lily-text-area-input-with-character-counter>',
        );

        expect(host.classList.contains("text-area-input-with-character-counter")).toBe(true);
    });

    test("renders a textarea with aria-label and aria-describedby", () => {
        const host = render(
            '<lily-text-area-input-with-character-counter label="Feedback" max-length="500"></lily-text-area-input-with-character-counter>',
        );

        const textarea = host.querySelector("textarea") as HTMLTextAreaElement;
        expect(textarea.getAttribute("aria-label")).toBe("Feedback");
        const describedBy = textarea.getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();
        expect(host.querySelector(`#${describedBy}`)).toBeTruthy();
    });

    test("counter carries aria-live=polite and the default template", () => {
        const host = render(
            '<lily-text-area-input-with-character-counter label="Feedback" max-length="500"></lily-text-area-input-with-character-counter>',
        );

        const textarea = host.querySelector("textarea") as HTMLTextAreaElement;
        const counterId = textarea.getAttribute("aria-describedby")!;
        const counter = host.querySelector(`#${counterId}`) as HTMLSpanElement;
        expect(counter.getAttribute("aria-live")).toBe("polite");
        expect(counter.textContent).toBe("0 of 500 characters");
    });

    test("counter updates reactively as the user types", () => {
        const host = render(
            '<lily-text-area-input-with-character-counter label="Feedback" max-length="500"></lily-text-area-input-with-character-counter>',
        );

        const textarea = host.querySelector("textarea") as HTMLTextAreaElement;
        const counterId = textarea.getAttribute("aria-describedby")!;
        const counter = host.querySelector(`#${counterId}`) as HTMLSpanElement;

        textarea.value = "Hello";
        textarea.dispatchEvent(new Event("input", { bubbles: true }));

        expect(counter.textContent).toBe("5 of 500 characters");
    });

    test("honours a custom counter-template", () => {
        const host = render(
            '<lily-text-area-input-with-character-counter label="Feedback" max-length="10" counter-template="{count}/{max}"></lily-text-area-input-with-character-counter>',
        );

        const textarea = host.querySelector("textarea") as HTMLTextAreaElement;
        const counterId = textarea.getAttribute("aria-describedby")!;
        const counter = host.querySelector(`#${counterId}`) as HTMLSpanElement;
        expect(counter.textContent).toBe("0/10");
    });

    test("exposes a live value property that also updates the counter", () => {
        const host = render(
            '<lily-text-area-input-with-character-counter label="Feedback" max-length="500"></lily-text-area-input-with-character-counter>',
        ) as unknown as TextAreaInputWithCharacterCounter;

        host.value = "abcd";
        expect(host.value).toBe("abcd");
        const textarea = host.querySelector("textarea") as HTMLTextAreaElement;
        const counterId = textarea.getAttribute("aria-describedby")!;
        expect(host.querySelector(`#${counterId}`)!.textContent).toBe("4 of 500 characters");
    });

    test("required and disabled propagate to the textarea", () => {
        const host = render(
            '<lily-text-area-input-with-character-counter label="Feedback" max-length="500" required disabled></lily-text-area-input-with-character-counter>',
        );

        const textarea = host.querySelector("textarea") as HTMLTextAreaElement;
        expect(textarea.required).toBe(true);
        expect(textarea.disabled).toBe(true);
    });
});
