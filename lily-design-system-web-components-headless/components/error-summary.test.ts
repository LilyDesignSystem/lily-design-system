import { afterEach, describe, expect, test } from "vitest";

import { ErrorSummary } from "./error-summary.js";

if (!customElements.get("lily-error-summary")) {
    customElements.define("lily-error-summary", ErrorSummary);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ErrorSummary", () => {
    test("carries the base class, role=alert, and tabindex=-1", () => {
        const host = render('<lily-error-summary title="There is a problem"></lily-error-summary>');

        expect(host.className).toBe("error-summary");
        expect(host.getAttribute("role")).toBe("alert");
        expect(host.tabIndex).toBe(-1);
    });

    test("renders an h2 heading with the title", () => {
        const host = render('<lily-error-summary title="There is a problem"></lily-error-summary>');

        const heading = host.querySelector("h2")!;
        expect(heading.textContent).toBe("There is a problem");
    });

    test("aria-labelledby references the heading id", () => {
        const host = render('<lily-error-summary title="There is a problem"></lily-error-summary>');

        const heading = host.querySelector("h2")!;
        expect(host.getAttribute("aria-labelledby")).toBe(heading.id);
        expect(heading.id).not.toBe("");
    });

    test("preserves the error list content after the heading", () => {
        const host = render(
            '<lily-error-summary title="There is a problem"><ul><li><a href="#name">Enter your name</a></li></ul></lily-error-summary>',
        );

        const heading = host.querySelector("h2")!;
        const list = host.querySelector("ul")!;
        expect(list.previousElementSibling).toBe(heading);
        expect(list.querySelector("a")!.textContent).toBe("Enter your name");
    });

    test("shows a change to its attributes after it is mounted (P50-T28)", async () => {
        document.body.innerHTML = `<lily-error-summary title="There is a problem"><ul><li>Enter a name</li></ul></lily-error-summary>`;
        const el = document.querySelector("lily-error-summary")!;
        el.setAttribute("title", "There are 2 problems");
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(el.querySelectorAll("h2").length).toBe(1);
        expect(el.querySelector("h2")!.textContent).toBe("There are 2 problems");
        expect(el.getAttribute("aria-labelledby")).toBe(el.querySelector("h2")!.id);
        expect(el.textContent).toContain("Enter a name");
    });
});
