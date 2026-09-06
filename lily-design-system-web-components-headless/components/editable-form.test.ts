import { afterEach, describe, expect, test } from "vitest";

import { EditableForm } from "./editable-form.js";

if (!customElements.get("lily-editable-form")) {
    customElements.define("lily-editable-form", EditableForm);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EditableForm", () => {
    test("renders a native form with the base class", () => {
        const host = render('<lily-editable-form label="Edit profile"></lily-editable-form>');

        expect(host.querySelector("form")!.classList.contains("editable-form")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-editable-form label="Edit profile"></lily-editable-form>');

        expect(host.querySelector("form")!.getAttribute("aria-label")).toBe("Edit profile");
    });

    test("the form is hidden when editing is absent", () => {
        const host = render('<lily-editable-form label="Edit profile"></lily-editable-form>');

        expect((host.querySelector("form") as HTMLFormElement).hidden).toBe(true);
    });

    test("the form is visible when editing is present", () => {
        const host = render('<lily-editable-form label="Edit profile" editing></lily-editable-form>');

        expect((host.querySelector("form") as HTMLFormElement).hidden).toBe(false);
    });

    test("moves form content into the form", () => {
        const host = render(
            '<lily-editable-form label="Edit profile" editing><input name="name"></lily-editable-form>',
        );

        expect(host.querySelector("form input[name=name]")).toBeTruthy();
    });

    test("submitting prevents default and reverts editing", () => {
        const host = render('<lily-editable-form label="Edit profile" editing></lily-editable-form>');
        const form = host.querySelector("form") as HTMLFormElement;

        const event = new Event("submit", { bubbles: true, cancelable: true });
        form.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
        expect(host.hasAttribute("editing")).toBe(false);
        expect(form.hidden).toBe(true);
    });

    test("Escape reverts editing and fires lily-cancel", () => {
        const host = render('<lily-editable-form label="Edit profile" editing></lily-editable-form>');
        const form = host.querySelector("form") as HTMLFormElement;

        let cancelled = false;
        host.addEventListener("lily-cancel", () => {
            cancelled = true;
        });
        form.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));

        expect(cancelled).toBe(true);
        expect(host.hasAttribute("editing")).toBe(false);
        expect(form.hidden).toBe(true);
    });
});
