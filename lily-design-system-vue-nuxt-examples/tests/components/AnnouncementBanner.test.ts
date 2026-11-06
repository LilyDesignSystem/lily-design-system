import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import AnnouncementBanner from "../../components/AnnouncementBanner.vue";

describe("AnnouncementBanner", () => {
    it("renders with class", () => {
        const { container } = render(AnnouncementBanner, {
            props: { label: "Test" },
            slots: { default: "content" },
        });
        const el = container.querySelector(".announcement-banner");
        expect(el).toBeTruthy();
    });

    it("has role=region with its label", () => {
        const { container } = render(AnnouncementBanner, {
            props: { label: "Story" },
            slots: { default: "content" },
        });
        const root = container.querySelector(".announcement-banner");
        expect(root?.getAttribute("role")).toBe("region");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });
});
