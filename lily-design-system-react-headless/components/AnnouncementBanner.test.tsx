import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import AnnouncementBanner from "./AnnouncementBanner";

describe("AnnouncementBanner", () => {
    it("renders with class", () => {
        const { container } = render(<AnnouncementBanner label="Test">content</AnnouncementBanner>);
        const el = container.querySelector(".announcement-banner");
        expect(el).toBeTruthy();
    });

    it("has role=region with its label", () => {
        const { container } = render(
            <AnnouncementBanner label="Story">content</AnnouncementBanner>,
        );
        const root = container.querySelector(".announcement-banner");
        expect(root?.getAttribute("role")).toBe("region");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });
});
