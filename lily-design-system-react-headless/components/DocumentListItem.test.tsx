import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import DocumentListItem from "./DocumentListItem";

describe("DocumentListItem", () => {
    it("renders with class", () => {
        const { container } = render(<DocumentListItem>content</DocumentListItem>);
        const el = container.querySelector(".document-list-item");
        expect(el).toBeTruthy();
    });

    it("renders no aria-label: the link inside names the item", () => {
        const { container } = render(
            <DocumentListItem>
                <a href="/a">A</a>
            </DocumentListItem>,
        );
        expect(container.querySelector(".document-list-item")?.hasAttribute("aria-label")).toBe(
            false,
        );
    });
});
