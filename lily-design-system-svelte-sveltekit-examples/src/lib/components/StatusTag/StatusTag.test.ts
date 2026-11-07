import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import StatusTag from "./StatusTag.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("StatusTag", () => {
    it("renders with class", () => {
        const { container } = render(StatusTag, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".status-tag");
        expect(el).toBeTruthy();
    });

    it("is a static label, with label as hidden text", () => {
        const { container } = render(StatusTag, {
            props: { label: "Status:", children: textSnippet("Done") },
        });
        const el = container.querySelector(".status-tag")!;
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.hasAttribute("aria-label")).toBe(false);
        expect(el.querySelector(".screen-reader-span")!.textContent).toBe("Status: ");
    });
});
