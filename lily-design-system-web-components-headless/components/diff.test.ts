import { afterEach, describe, expect, test } from "vitest";

import { Diff } from "./diff.js";

if (!customElements.get("lily-diff")) {
    customElements.define("lily-diff", Diff);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Diff", () => {
    test("carries the base class and role=group", () => {
        const host = render('<lily-diff label="Before and after"></lily-diff>');

        expect(host.className).toBe("diff");
        expect(host.getAttribute("role")).toBe("group");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-diff label="Before and after"></lily-diff>');

        expect(host.getAttribute("aria-label")).toBe("Before and after");
    });

    test("preserves the two comparison panels as children", () => {
        const host = render(
            '<lily-diff label="Before and after"><div>Before</div><div>After</div></lily-diff>',
        );

        expect(host.children).toHaveLength(2);
        expect(host.children[0].textContent).toBe("Before");
        expect(host.children[1].textContent).toBe("After");
    });
});
