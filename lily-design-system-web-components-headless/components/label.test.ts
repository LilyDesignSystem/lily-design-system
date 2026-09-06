import { afterEach, describe, expect, test } from "vitest";

import { Label } from "./label.js";

if (!customElements.get("lily-label")) {
    customElements.define("lily-label", Label);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Label", () => {
    test("renders a native label", () => {
        const host = render("<lily-label>Name</lily-label>");

        expect(host.querySelector("label")).toBeTruthy();
    });

    test("sets the for attribute when given", () => {
        const host = render('<lily-label for="name-input">Name</lily-label>');

        expect(host.querySelector("label")!.getAttribute("for")).toBe("name-input");
    });

    test("omits the for attribute when not given", () => {
        const host = render("<lily-label>Name</lily-label>");

        expect(host.querySelector("label")!.hasAttribute("for")).toBe(false);
    });

    test("moves the consumer's content inside the label", () => {
        const host = render("<lily-label>Name</lily-label>");

        expect(host.querySelector("label")!.textContent).toBe("Name");
    });

    test("the consumer's class is appended to the base class", () => {
        const host = render('<lily-label class="my-extra">Name</lily-label>');

        expect(host.querySelector("label")!.className).toBe("label my-extra");
    });

    test("passes through rest attributes such as id", () => {
        const host = render('<lily-label id="name-label">Name</lily-label>');

        expect(host.querySelector("label")!.id).toBe("name-label");
    });
});
