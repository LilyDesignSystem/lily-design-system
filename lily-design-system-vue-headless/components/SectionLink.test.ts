import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import SectionLink from "./SectionLink.vue";

describe("SectionLink", () => {
  it("renders with class", () => {
    const { container } = render(SectionLink, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".section-link");
    expect(el).toBeTruthy();
  });
});
