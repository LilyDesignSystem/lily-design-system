import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import BackToTop from "./BackToTop.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("BackToTop", () => {
    it("renders with class", () => {
        const { container } = render(BackToTop, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".back-to-top");
        expect(el).toBeTruthy();
    });
});
