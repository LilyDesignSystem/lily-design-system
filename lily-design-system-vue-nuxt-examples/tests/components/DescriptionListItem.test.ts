import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import DescriptionListItem from "../../components/DescriptionListItem.vue";

describe("DescriptionListItem", () => {
    it("renders with class", () => {
        const { container } = render(DescriptionListItem, {
            slots: { default: "content" },
        });
        const el = container.querySelector(".description-list-item");
        expect(el).toBeTruthy();
    });
});
