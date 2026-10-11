import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Tag.vue";

describe("Tag", () => {
    test("renders a span with the base class and the visible text", () => {
        const { container } = render(Subject, { props: { label: "Category: Design" }, slots: { default: "Design" } });
        const tag = container.querySelector("span.tag")!;
        expect(tag.tagName).toBe("SPAN");
        expect(tag.textContent).toContain("Design");
    });

    test("is not a live region by default", () => {
        render(Subject, { props: { label: "Category: Design" }, slots: { default: "Design" } });
        expect(screen.queryByRole("status")).toBeNull();
    });

    test("by default the label is screen-reader text appended to the exposed content", () => {
        const { container } = render(Subject, { props: { label: "Priority: High" }, slots: { default: "High" } });
        const tag = container.querySelector("span.tag")!;
        expect(tag.hasAttribute("aria-label")).toBe(false);
        expect(tag.querySelector(".screen-reader-span")?.textContent).toBe("Priority: High");
        expect(tag.querySelector("[aria-hidden]")).toBeNull();
        expect(tag.textContent).toContain("High");
    });

    test("live renders a status region named by the label", () => {
        render(Subject, { props: { label: "Build: Passing", live: true }, slots: { default: "Passing" } });
        const tag = screen.getByRole("status");
        expect(tag.tagName).toBe("SPAN");
        expect(tag.getAttribute("aria-label")).toBe("Build: Passing");
        expect(tag.textContent?.trim()).toBe("Passing");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "Tag", "data-testid": "my-tag", id: "tag-1" }, slots: { default: "Label" } });
        expect(screen.getByTestId("my-tag").getAttribute("id")).toBe("tag-1");
    });
});
