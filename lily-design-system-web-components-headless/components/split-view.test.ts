import { afterEach, describe, expect, test } from "vitest";

import { SplitView } from "./split-view.js";

if (!customElements.get("lily-split-view")) {
    customElements.define("lily-split-view", SplitView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SplitView", () => {
    test("renders itself with the base class", () => {
        const host = render(
            '<lily-split-view label="Files and editor"><div slot="primary"></div><div slot="secondary"></div></lily-split-view>',
        );

        expect(host.classList.contains("split-view")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-split-view label="Files and editor"><div slot="primary"></div><div slot="secondary"></div></lily-split-view>',
        );

        expect(host.getAttribute("aria-label")).toBe("Files and editor");
    });

    test("reflects orientation and splitPercent as data attributes", () => {
        const host = render(
            '<lily-split-view label="Files and editor" orientation="vertical" split-percent="30"><div slot="primary"></div><div slot="secondary"></div></lily-split-view>',
        );

        expect(host.getAttribute("data-orientation")).toBe("vertical");
        expect(host.getAttribute("data-split-percent")).toBe("30");
    });

    test("defaults orientation to horizontal and splitPercent to 50", () => {
        const host = render(
            '<lily-split-view label="Files and editor"><div slot="primary"></div><div slot="secondary"></div></lily-split-view>',
        );

        expect(host.getAttribute("data-orientation")).toBe("horizontal");
        expect(host.getAttribute("data-split-percent")).toBe("50");
    });

    test("renders primary content inside a split-view-primary section", () => {
        const host = render(
            '<lily-split-view label="Files and editor"><div slot="primary" data-testid="browser"></div><div slot="secondary"></div></lily-split-view>',
        );

        const section = host.querySelector("section.split-view-primary");
        expect(section).toBeTruthy();
        expect(section!.querySelector('[data-testid="browser"]')).toBeTruthy();
    });

    test("renders secondary content inside a split-view-secondary section", () => {
        const host = render(
            '<lily-split-view label="Files and editor"><div slot="primary"></div><div slot="secondary" data-testid="editor"></div></lily-split-view>',
        );

        const section = host.querySelector("section.split-view-secondary");
        expect(section).toBeTruthy();
        expect(section!.querySelector('[data-testid="editor"]')).toBeTruthy();
    });

    test("renders a default divider with full separator ARIA when none is supplied", () => {
        const host = render(
            '<lily-split-view label="Files and editor" split-percent="30"><div slot="primary"></div><div slot="secondary"></div></lily-split-view>',
        );

        const divider = host.querySelector(".split-view-divider");
        expect(divider).toBeTruthy();
        expect(divider!.getAttribute("role")).toBe("separator");
        expect(divider!.getAttribute("aria-orientation")).toBe("horizontal");
        expect(divider!.getAttribute("aria-valuenow")).toBe("30");
        expect(divider!.getAttribute("aria-valuemin")).toBe("0");
        expect(divider!.getAttribute("aria-valuemax")).toBe("100");
        expect(divider!.getAttribute("tabindex")).toBe("0");
    });

    test("uses a custom divider when supplied, instead of the default", () => {
        const host = render(
            '<lily-split-view label="Files and editor">' +
                '<div slot="primary"></div>' +
                '<div slot="secondary"></div>' +
                '<div slot="divider" data-testid="custom-divider"></div>' +
                "</lily-split-view>",
        );

        expect(host.querySelector('[data-testid="custom-divider"]')).toBeTruthy();
        expect(host.querySelector(".split-view-divider")).toBeFalsy();
    });

    test("panels and divider appear in primary, divider, secondary order", () => {
        const host = render(
            '<lily-split-view label="Files and editor"><div slot="primary"></div><div slot="secondary"></div></lily-split-view>',
        );

        const children = Array.from(host.children);
        expect(children[0].className).toBe("split-view-primary");
        expect(children[1].className).toBe("split-view-divider");
        expect(children[2].className).toBe("split-view-secondary");
    });
});
