import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import SectionListItem from "./SectionListItem.vue";

describe("SectionListItem", () => {
  it("renders with class", () => {
    const { container } = render(SectionListItem, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".section-list-item");
    expect(el).toBeTruthy();
  });
});
