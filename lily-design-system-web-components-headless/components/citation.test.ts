import { afterEach, describe, expect, test } from "vitest";

import { Citation } from "./citation.js";

if (!customElements.get("lily-citation")) {
    customElements.define("lily-citation", Citation);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Citation", () => {
    test("renders a native cite", () => {
        const host = render("<lily-citation>The Origin of Species</lily-citation>");

        expect(host.querySelector("cite.citation")).toBeTruthy();
    });

    test("moves original content into the cite", () => {
        const host = render("<lily-citation>The Origin of Species</lily-citation>");

        expect(host.querySelector("cite")!.textContent).toBe("The Origin of Species");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-citation class="work">Title</lily-citation>');

        expect(host.querySelector("cite")!.className).toBe("citation work");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-citation>Title</lily-citation>");

        (host as unknown as Citation).connectedCallback();

        expect(host.querySelectorAll("cite").length).toBe(1);
    });

    test("shows a change to its attributes after it is mounted (P50-T28)", () => {
        document.body.innerHTML = `<lily-citation label="Source">Smith 2020</lily-citation>`;
        const el = document.querySelector("lily-citation")!;
        el.setAttribute("label", "Cited from");
        const cite = el.querySelector("cite")!;
        expect(cite.textContent).toBe("Cited from Smith 2020");
        expect(cite.querySelectorAll(".screen-reader-span").length).toBe(1);
        el.removeAttribute("label");
        expect(cite.textContent).toBe("Smith 2020");
    });
});
