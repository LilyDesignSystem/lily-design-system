import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import SectionNav from "./SectionNav.vue";

describe("SectionNav", () => {
  it("renders with class", () => {
    const { container } = render(SectionNav, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".section-nav");
    expect(el).toBeTruthy();
  });
});
