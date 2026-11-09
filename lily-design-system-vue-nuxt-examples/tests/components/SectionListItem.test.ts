import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import SectionListItem from "../../components/SectionListItem.vue";

describe("SectionListItem", () => {
    it("renders with class", () => {
        const { container } = render(SectionListItem, {
            slots: { default: "content" },
        });
        const el = container.querySelector(".section-list-item");
        expect(el).toBeTruthy();
    });

    it("sets data-current only when current", () => {
        const { container } = render(SectionListItem, {
            props: { current: true },
            slots: { default: "content" },
        });
        expect(container.querySelector(".section-list-item")?.getAttribute("data-current")).toBe(
            "",
        );
        const plain = render(SectionListItem, { slots: { default: "content" } });
        expect(
            plain.container.querySelector(".section-list-item")?.hasAttribute("data-current"),
        ).toBe(false);
    });

    it("renders no aria-label", () => {
        const { container } = render(SectionListItem, {
            attrs: { label: "Ignored" },
            slots: { default: "content" },
        } as never);
        expect(container.querySelector(".section-list-item")?.hasAttribute("aria-label")).toBe(
            false,
        );
    });
});
