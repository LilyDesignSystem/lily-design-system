import { afterEach, describe, expect, test } from "vitest";

import { CodeBlock } from "./code-block.js";

if (!customElements.get("lily-code-block")) {
    customElements.define("lily-code-block", CodeBlock);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CodeBlock", () => {
    test("renders a native pre containing a nested code element", () => {
        const host = render("<lily-code-block>const x = 1;</lily-code-block>");

        const pre = host.querySelector("pre.code-block") as HTMLPreElement;
        expect(pre).toBeTruthy();
        expect(pre.querySelector("code")).toBeTruthy();
    });

    test("moves original content into the nested code element", () => {
        const host = render("<lily-code-block>const x = 1;</lily-code-block>");

        expect(host.querySelector("pre code")!.textContent).toBe("const x = 1;");
    });

    test("no role or aria-label when label is absent", () => {
        const host = render("<lily-code-block>x</lily-code-block>");

        const pre = host.querySelector("pre")!;
        expect(pre.hasAttribute("aria-label")).toBe(false);
        expect(pre.hasAttribute("role")).toBe(false);
    });

    test("label sets aria-label and role=region", () => {
        const host = render('<lily-code-block label="Example snippet">x</lily-code-block>');

        const pre = host.querySelector("pre")!;
        expect(pre.getAttribute("aria-label")).toBe("Example snippet");
        expect(pre.getAttribute("role")).toBe("region");
    });

    test("line-numbers sets data-line-numbers", () => {
        const host = render("<lily-code-block line-numbers>x</lily-code-block>");

        expect(host.querySelector("pre")!.getAttribute("data-line-numbers")).toBe("true");
    });

    test("highlight-lines sets data-highlight-lines", () => {
        const host = render('<lily-code-block highlight-lines="2,4">x</lily-code-block>');

        expect(host.querySelector("pre")!.getAttribute("data-highlight-lines")).toBe("2,4");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-code-block>x</lily-code-block>");

        (host as unknown as CodeBlock).connectedCallback();

        expect(host.querySelectorAll("pre").length).toBe(1);
    });
});
