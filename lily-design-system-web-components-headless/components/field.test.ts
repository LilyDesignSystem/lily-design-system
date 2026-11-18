import { afterEach, describe, expect, test } from "vitest";

import { EmailInput } from "./email-input.js";
import { Field } from "./field.js";
import { Select } from "./select.js";
import { TextInput } from "./text-input.js";

if (!customElements.get("lily-field")) {
    customElements.define("lily-field", Field);
}
for (const [tag, element] of [
    ["lily-email-input", EmailInput],
    ["lily-text-input", TextInput],
    ["lily-select", Select],
] as const) {
    if (!customElements.get(tag)) customElements.define(tag, element);
}

/** No two elements in the document share an id. */
function idsAreUnique(): boolean {
    const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
    return new Set(ids).size === ids.length;
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
        const host = render(
            '<lily-field label="Name" input-id="my-input"><input id="my-input" /></lily-field>',
        );

        expect(host.querySelector("label")!.htmlFor).toBe("my-input");
    });

    // P38-T3: around a Lily input component, the visible label labels the <input> inside it, and no id is duplicated.
    for (const [tag, control] of [
        ["lily-email-input", "input"],
        ["lily-text-input", "input"],
        ["lily-select", "select"],
    ] as const) {
        test(`labels the ${control} inside <${tag}>`, () => {
            render(
                `<lily-field label="Email address"><${tag} label="Email address"></${tag}></lily-field>`,
            );
            const el = document.querySelector(`.field ${control}`) as
                HTMLInputElement | HTMLSelectElement;
            expect(el.labels).toHaveLength(1);
            expect(el.labels![0]!.textContent).toBe("Email address");
            expect(idsAreUnique()).toBe(true);
        });

        test(`labels the ${control} inside <${tag}> given its own id`, () => {
            render(
                `<lily-field label="Email address"><${tag} id="email" label="Email address"></${tag}></lily-field>`,
            );
            const el = document.querySelector(`.field ${control}`) as
                HTMLInputElement | HTMLSelectElement;
            expect(el.id).toBe("email");
            expect(el.labels).toHaveLength(1);
            expect(document.querySelector(tag)!.hasAttribute("id")).toBe(false);
            expect(idsAreUnique()).toBe(true);
        });
    }

    test("labels the control of an input component that rendered before the field", () => {
        const input = document.createElement("lily-email-input");
        input.setAttribute("label", "Email address");
        document.body.appendChild(input); // renders its <input> now
        const field = document.createElement("lily-field");
        field.setAttribute("label", "Email address");
        field.appendChild(input);
        document.body.appendChild(field);
        const el = document.querySelector(".field input") as HTMLInputElement;
        expect(el.labels).toHaveLength(1);
        expect(idsAreUnique()).toBe(true);
    });

    test("renders a description paragraph before the content", () => {
        const host = render(
            '<lily-field label="Name" description="Enter full name"><input /></lily-field>',
        );

        const description = host.querySelector("p")!;
        expect(description.textContent).toBe("Enter full name");
        expect(description.nextElementSibling!.tagName).toBe("INPUT");
    });

    test("renders an error paragraph with role=alert after the content", () => {
        const host = render(
            '<lily-field label="Email" error="Email is required"><input /></lily-field>',
        );

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
