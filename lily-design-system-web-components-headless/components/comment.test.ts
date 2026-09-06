import { afterEach, describe, expect, test } from "vitest";

import { Comment } from "./comment.js";

if (!customElements.get("lily-comment")) {
    customElements.define("lily-comment", Comment);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Comment", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render("<lily-comment>Nice work!</lily-comment>");

        expect(host.className).toBe("comment");
    });

    test("has no aria-label by default", () => {
        const host = render("<lily-comment>Nice work!</lily-comment>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("applies aria-label when provided", () => {
        const host = render('<lily-comment label="Comment by Ada">Nice work!</lily-comment>');

        expect(host.getAttribute("aria-label")).toBe("Comment by Ada");
    });

    test("preserves children content", () => {
        const host = render("<lily-comment><p>Nice work!</p></lily-comment>");

        expect(host.querySelector("p")!.textContent).toBe("Nice work!");
    });

    test("merges the consumer's class attribute", () => {
        const host = render('<lily-comment class="highlighted">Text</lily-comment>');

        expect(host.classList.contains("comment")).toBe(true);
        expect(host.classList.contains("highlighted")).toBe(true);
    });
});
