import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SharePage from "./SharePage";

describe("SharePage", () => {
    it("renders with class", () => {
        const { container } = render(<SharePage label="Test">content</SharePage>);
        const el = container.querySelector(".share-page");
        expect(el).toBeTruthy();
    });

    it("has role=group with its label", () => {
        const { container } = render(<SharePage label="Story">content</SharePage>);
        const root = container.querySelector(".share-page");
        expect(root?.getAttribute("role")).toBe("group");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });
});
