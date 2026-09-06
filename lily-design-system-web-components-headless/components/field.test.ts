import { afterEach, describe, expect, test } from "vitest";

import { Field } from "./field.js";

if (!customElements.get("lily-field")) {
    customElements.define("lily-field", Field);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Field", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render('<lily-field label="Name"><input /></lily-field>');

        expect(host.className).toBe("field");
    });

    test("renders a label before the field content, linked via for/id", () => {
        const host = render('<lily-field label="Name"><input /></lily-field>');

        const label = host.querySelector("label")!;
        const input = host.querySelector("input") as HTMLInputElement;
        expect(label.textContent).toBe("Name");
        expect(label.htmlFor).toBe(input.id);
        expect(input.id).not.toBe("");
        expect(label.nextElementSibling).toBe(input);
    });

    test("respects a caller-supplied input-id instead of assigning its own", () => {
        const host = render('<lily-field label="Name" input-id="my-input"><input id="my-input" /></lily-field>');

        expect(host.querySelector("label")!.htmlFor).toBe("my-input");
    });

    test("renders a description paragraph before the content", () => {
        const host = render('<lily-field label="Name" description="Enter full name"><input /></lily-field>');

        const description = host.querySelector("p")!;
        expect(description.textContent).toBe("Enter full name");
        expect(description.nextElementSibling!.tagName).toBe("INPUT");
    });

    test("renders an error paragraph with role=alert after the content", () => {
        const host = render('<lily-field label="Email" error="Email is required"><input /></lily-field>');

        const error = host.querySelector('[role="alert"]') as HTMLElement;
        expect(error.textContent).toBe("Email is required");
        expect(error.previousElementSibling!.tagName).toBe("INPUT");
    });

    test("required adds a data-required attribute and a decorative asterisk", () => {
        const host = render('<lily-field label="Email" required><input /></lily-field>');

        expect(host.hasAttribute("data-required")).toBe(true);
        const asterisk = host.querySelector("label > span[aria-hidden]")!;
        expect(asterisk.getAttribute("aria-hidden")).toBe("true");
    });

    test("removing required removes the asterisk and data-required", () => {
        const host = render('<lily-field label="Email" required><input /></lily-field>');

        host.removeAttribute("required");

        expect(host.hasAttribute("data-required")).toBe(false);
        expect(host.querySelector("label > span[aria-hidden]")).toBeNull();
    });
});
