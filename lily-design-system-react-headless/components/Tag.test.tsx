import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Tag";

describe("Tag", () => {
    test("renders a span with the base class and the visible text", () => {
        const { container } = render(<Subject label="Category: Design">Design</Subject>);
        const tag = container.querySelector("span.tag")!;
        expect(tag.tagName).toBe("SPAN");
        expect(tag.textContent).toContain("Design");
    });

    test("is not a live region by default", () => {
        render(<Subject label="Category: Design">Design</Subject>);
        expect(screen.queryByRole("status")).toBeNull();
    });

    test("by default the label is screen-reader text appended to the exposed content", () => {
        const { container } = render(<Subject label="Priority: High">High</Subject>);
        const tag = container.querySelector("span.tag")!;
        expect(tag.hasAttribute("aria-label")).toBe(false);
        expect(tag.querySelector(".screen-reader-span")?.textContent).toBe("Priority: High");
        expect(tag.querySelector("[aria-hidden]")).toBeNull();
        expect(tag.textContent).toContain("High");
    });

    test("live renders a status region named by the label", () => {
        render(<Subject label="Build: Passing" live>Passing</Subject>);
        const tag = screen.getByRole("status");
        expect(tag.tagName).toBe("SPAN");
        expect(tag.getAttribute("aria-label")).toBe("Build: Passing");
        expect(tag.textContent).toBe("Passing");
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Tag" data-testid="my-tag" id="tag-1">Label</Subject>);
        expect(screen.getByTestId("my-tag").getAttribute("id")).toBe("tag-1");
    });

    test("a control inside the tag, such as a remove button, is not hidden from assistive technology", () => {
        render(
            <Subject label="filter">
                Red <button type="button">Remove Red</button>
            </Subject>,
        );
        const button = screen.getByRole("button", { name: "Remove Red" });
        expect(button.closest("[aria-hidden]")).toBeNull();
    });
});
