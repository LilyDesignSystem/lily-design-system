import { afterEach, describe, expect, test } from "vitest";

import { Question } from "./question.js";

if (!customElements.get("lily-question")) {
    customElements.define("lily-question", Question);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Question", () => {
    test("carries the base class", () => {
        const host = render("<lily-question>What is your favourite colour?</lily-question>");

        expect(host.classList.contains("question")).toBe(true);
    });

    test("sets aria-label when label is provided", () => {
        const host = render(
            '<lily-question label="Survey question 1">What is your favourite colour?</lily-question>',
        );

        expect(host.getAttribute("aria-label")).toBe("Survey question 1");
    });

    test("omits aria-label when label is absent", () => {
        const host = render("<lily-question>What is your favourite colour?</lily-question>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("keeps children content in place", () => {
        const host = render("<lily-question>What is your favourite colour?</lily-question>");

        expect(host.textContent).toBe("What is your favourite colour?");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render(
            '<lily-question class="my-question">What is your favourite colour?</lily-question>',
        );

        expect(host.getAttribute("class")).toBe("question my-question");
    });

    test("is idempotent across repeated connectedCallback invocations", () => {
        const host = render("<lily-question label=\"Q1\">What is your favourite colour?</lily-question>");

        (host as unknown as Question).connectedCallback();

        expect(host.getAttribute("aria-label")).toBe("Q1");
        expect(host.classList.contains("question")).toBe(true);
    });
});
