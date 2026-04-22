import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import SectionList from "./SectionList.vue";

describe("SectionList", () => {
  it("renders with class", () => {
    const { container } = render(SectionList, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".section-list");
    expect(el).toBeTruthy();
  });
});
