import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SectionListItem from "./SectionListItem";

describe("SectionListItem", () => {
    it("renders with class", () => {
        const { container } = render(<SectionListItem>content</SectionListItem>);
        const el = container.querySelector(".section-list-item");
        expect(el).toBeTruthy();
    });

    it("renders no aria-label: the link inside names the item", () => {
        const { container } = render(
            <SectionListItem>
                <a href="/a">A</a>
            </SectionListItem>,
        );
        expect(container.querySelector(".section-list-item")?.hasAttribute("aria-label")).toBe(
            false,
        );
    });
});
