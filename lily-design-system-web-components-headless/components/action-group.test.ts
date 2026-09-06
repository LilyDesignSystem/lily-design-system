import { afterEach, describe, expect, test } from "vitest";

import { ActionGroup } from "./action-group.js";

if (!customElements.get("lily-action-group")) {
    customElements.define("lily-action-group", ActionGroup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ActionGroup", () => {
    test("renders itself as the group with role=group", () => {
        const host = render('<lily-action-group label="Document actions"></lily-action-group>');

        expect(host.getAttribute("role")).toBe("group");
        expect(host.classList.contains("action-group")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-action-group label="Document actions"></lily-action-group>');

        expect(host.getAttribute("aria-label")).toBe("Document actions");
    });

    test("renders visible action buttons as children", () => {
        const host = render(
            '<lily-action-group label="Document actions"><button type="button">Save</button></lily-action-group>',
        );

        expect(host.querySelector("button")!.textContent).toBe("Save");
    });

    test("renders no overflow trigger when no slot=overflow child is provided", () => {
        const host = render('<lily-action-group label="Document actions"></lily-action-group>');

        expect(host.querySelector(".action-group-overflow-trigger")).toBeNull();
    });

    test("renders an overflow trigger and moves slot=overflow content into the panel", () => {
        const host = render(
            '<lily-action-group label="Document actions" overflow-label="More actions">' +
                '<div slot="overflow"><button type="button">Archive</button></div>' +
                "</lily-action-group>",
        );

        const trigger = host.querySelector(".action-group-overflow-trigger") as HTMLButtonElement;
        expect(trigger).toBeTruthy();
        expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
        expect(trigger.getAttribute("aria-label")).toBe("More actions");
        expect(host.querySelector(".action-group-overflow-menu button")!.textContent).toBe("Archive");
    });

    test("overflow panel is hidden by default and trigger reports aria-expanded=false", () => {
        const host = render(
            '<lily-action-group label="Document actions"><div slot="overflow"></div></lily-action-group>',
        );

        const trigger = host.querySelector(".action-group-overflow-trigger") as HTMLButtonElement;
        const panel = host.querySelector(".action-group-overflow-menu") as HTMLElement;
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        expect(panel.hidden).toBe(true);
    });

    test("clicking the trigger opens the panel, sets aria-expanded, and fires lily-overflow-toggle", () => {
        const host = render(
            '<lily-action-group label="Document actions"><div slot="overflow"></div></lily-action-group>',
        );
        const trigger = host.querySelector(".action-group-overflow-trigger") as HTMLButtonElement;
        const panel = host.querySelector(".action-group-overflow-menu") as HTMLElement;

        let detail: { open: boolean } | undefined;
        host.addEventListener("lily-overflow-toggle", (event) => {
            detail = (event as CustomEvent<{ open: boolean }>).detail;
        });
        trigger.click();

        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        expect(panel.hidden).toBe(false);
        expect(detail).toEqual({ open: true });
        expect(host.hasAttribute("overflow-open")).toBe(true);
    });

    test("overflow-open attribute can be set externally to open the panel", () => {
        const host = render(
            '<lily-action-group label="Document actions"><div slot="overflow"></div></lily-action-group>',
        );

        host.setAttribute("overflow-open", "");

        const trigger = host.querySelector(".action-group-overflow-trigger") as HTMLButtonElement;
        const panel = host.querySelector(".action-group-overflow-menu") as HTMLElement;
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        expect(panel.hidden).toBe(false);
    });
});
