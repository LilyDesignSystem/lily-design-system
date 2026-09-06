import { afterEach, describe, expect, test } from "vitest";

import { Form } from "./form.js";

if (!customElements.get("lily-form")) {
    customElements.define("lily-form", Form);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Form", () => {
    test("renders a native form with the base class", () => {
        const host = render('<lily-form label="Contact"></lily-form>');

        expect(host.querySelector("form")!.classList.contains("form")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-form label="Contact"></lily-form>');

        expect(host.querySelector("form")!.getAttribute("aria-label")).toBe("Contact");
    });

    test("moves form content into the form", () => {
        const host = render('<lily-form label="Contact"><input name="email"></lily-form>');

        expect(host.querySelector("form input[name=email]")).toBeTruthy();
    });

    test("prevents the default submit navigation", () => {
        const host = render('<lily-form label="Contact"></lily-form>');
        const form = host.querySelector("form") as HTMLFormElement;

        const event = new Event("submit", { bubbles: true, cancelable: true });
        form.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
    });

    test("the submit event still bubbles for the consumer to observe", () => {
        const host = render('<lily-form label="Contact"></lily-form>');
        const form = host.querySelector("form") as HTMLFormElement;

        let observed = false;
        host.addEventListener("submit", () => {
            observed = true;
        });
        form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

        expect(observed).toBe(true);
    });
});
