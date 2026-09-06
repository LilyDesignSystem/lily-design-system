import { afterEach, describe, expect, test } from "vitest";

import { CallToAction } from "./call-to-action.js";

if (!customElements.get("lily-call-to-action")) {
    customElements.define("lily-call-to-action", CallToAction);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CallToAction", () => {
    test("renders an <a> when href is provided", () => {
        const host = render('<lily-call-to-action href="/signup">Sign Up Now</lily-call-to-action>');

        const link = host.querySelector("a.call-to-action") as HTMLAnchorElement;
        expect(link).toBeTruthy();
        expect(link.getAttribute("href")).toBe("/signup");
        expect(host.querySelector("button")).toBeNull();
    });

    test("renders a <button type=button> when href is absent", () => {
        const host = render("<lily-call-to-action>Get Started</lily-call-to-action>");

        const button = host.querySelector("button.call-to-action") as HTMLButtonElement;
        expect(button).toBeTruthy();
        expect(button.type).toBe("button");
        expect(host.querySelector("a")).toBeNull();
    });

    test("moves original content into the rendered element", () => {
        const host = render("<lily-call-to-action>Get Started</lily-call-to-action>");

        expect(host.querySelector("button")!.textContent).toBe("Get Started");
    });

    test("uses label as an aria-label override", () => {
        const host = render('<lily-call-to-action label="Sign up for the newsletter" href="/signup">Sign Up</lily-call-to-action>');

        expect(host.querySelector("a")!.getAttribute("aria-label")).toBe("Sign up for the newsletter");
    });

    test("disabled only applies in button mode", () => {
        const host = render("<lily-call-to-action disabled>Get Started</lily-call-to-action>");

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("disabled is not set as an attribute on the anchor", () => {
        const host = render('<lily-call-to-action href="/signup" disabled>Sign Up</lily-call-to-action>');

        expect(host.querySelector("a")!.hasAttribute("disabled")).toBe(false);
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-call-to-action>Get Started</lily-call-to-action>");

        (host as unknown as CallToAction).connectedCallback();

        expect(host.querySelectorAll("button").length).toBe(1);
    });
});
