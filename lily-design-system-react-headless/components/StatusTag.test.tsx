import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import StatusTag from "./StatusTag";

describe("StatusTag", () => {
    it("renders with class", () => {
        const { container } = render(<StatusTag label="Test">content</StatusTag>);
        const el = container.querySelector(".status-tag");
        expect(el).toBeTruthy();
    });

    it("is a static label, with label as hidden text", () => {
        const { container } = render(<StatusTag label="Status:">Done</StatusTag>);
        const el = container.querySelector(".status-tag")!;
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.hasAttribute("aria-label")).toBe(false);
        expect(el.querySelector(".screen-reader-span")!.textContent).toBe("Status: ");
    });

    it("renders type as data-type, default when unset, as Svelte does", () => {
        const plain = render(<StatusTag>Draft</StatusTag>);
        expect(plain.container.querySelector(".status-tag")!.getAttribute("data-type")).toBe(
            "default",
        );
        const set = render(<StatusTag type="error">Failed</StatusTag>);
        expect(set.container.querySelector(".status-tag")!.getAttribute("data-type")).toBe("error");
    });
});
