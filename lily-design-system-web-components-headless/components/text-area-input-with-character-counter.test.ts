import { afterEach, describe, expect, test, vi } from "vitest";

import { TextAreaInputWithCharacterCounter } from "./text-area-input-with-character-counter.js";

if (!customElements.get("lily-text-area-input-with-character-counter")) {
    customElements.define(
        "lily-text-area-input-with-character-counter",
        TextAreaInputWithCharacterCounter,
    );
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

    test("the counter is not live itself, and uses the default template", () => {
        const host = render(
            '<lily-text-area-input-with-character-counter label="Feedback" max-length="500"></lily-text-area-input-with-character-counter>',
        );

        const textarea = host.querySelector("textarea") as HTMLTextAreaElement;
        const counterId = textarea.getAttribute("aria-describedby")!;
        const counter = host.querySelector(`#${counterId}`) as HTMLSpanElement;
        expect(host.querySelector("[aria-live]")).toBeNull();
        expect(counter.querySelector('[aria-hidden="true"]')!.textContent).toBe("0 / 500");
        expect(counter.querySelector('[role="status"]')!.textContent).toBe("0 / 500");
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

        expect(counter.querySelector('[aria-hidden="true"]')!.textContent).toBe("5 / 500");
    });

    test("typing is announced once, after the pause", () => {
        vi.useFakeTimers();
        const host = render(
            '<lily-text-area-input-with-character-counter label="Feedback" max-length="10"></lily-text-area-input-with-character-counter>',
        );
        const textarea = host.querySelector("textarea") as HTMLTextAreaElement;
        const status = host.querySelector('[role="status"]')!;
        for (const text of ["a", "ab", "abc"]) {
            textarea.value = text;
            textarea.dispatchEvent(new Event("input", { bubbles: true }));
            vi.advanceTimersByTime(300);
        }
        expect(status.textContent).toBe("0 / 10");
        vi.advanceTimersByTime(1000);
        expect(status.textContent).toBe("3 / 10");
        vi.useRealTimers();
    });

    test("honours a custom counter-template", () => {
        const host = render(
            '<lily-text-area-input-with-character-counter label="Feedback" max-length="10" counter-template="{count}/{max}"></lily-text-area-input-with-character-counter>',
        );

        const textarea = host.querySelector("textarea") as HTMLTextAreaElement;
        const counterId = textarea.getAttribute("aria-describedby")!;
        const counter = host.querySelector(`#${counterId}`) as HTMLSpanElement;
        expect(counter.querySelector('[aria-hidden="true"]')!.textContent).toBe("0/10");
    });

    test("exposes a live value property that also updates the counter", () => {
        const host = render(
            '<lily-text-area-input-with-character-counter label="Feedback" max-length="500"></lily-text-area-input-with-character-counter>',
        ) as unknown as TextAreaInputWithCharacterCounter;

        host.value = "abcd";
        expect(host.value).toBe("abcd");
        const textarea = host.querySelector("textarea") as HTMLTextAreaElement;
        const counterId = textarea.getAttribute("aria-describedby")!;
        expect(host.querySelector(`#${counterId} [aria-hidden="true"]`)!.textContent).toBe(
            "4 / 500",
        );
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

describe("TextAreaInputWithCharacterCounter follows its attributes (P50-T28)", () => {
    test("shows a change to its attributes and writes the count again", () => {
        const host = render(
            '<lily-text-area-input-with-character-counter label="Old" max-length="10" value="abc"></lily-text-area-input-with-character-counter>',
        );
        host.setAttribute("label", "New");
        host.setAttribute("max-length", "20");
        host.setAttribute("counter-template", "{count} of {max}");
        host.setAttribute("rows", "4");
        host.setAttribute("placeholder", "Write");
        host.setAttribute("required", "");
        host.setAttribute("disabled", "");
        host.setAttribute("class", "wide");
        const textarea = host.querySelector("textarea") as HTMLTextAreaElement;
        expect(host.className).toBe("text-area-input-with-character-counter wide");
        expect(textarea.getAttribute("aria-label")).toBe("New");
        expect(textarea.maxLength).toBe(20);
        expect(textarea.rows).toBe(4);
        expect(textarea.placeholder).toBe("Write");
        expect(textarea.required && textarea.disabled).toBe(true);
        expect(host.querySelector('[aria-hidden="true"]')?.textContent).toBe("3 of 20");
        host.setAttribute("value", "abcdef");
        expect(textarea.value).toBe("abcdef");
        expect(host.querySelector('[aria-hidden="true"]')?.textContent).toBe("6 of 20");
    });
});
