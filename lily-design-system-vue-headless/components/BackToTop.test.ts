import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import BackToTop from "./BackToTop.vue";

describe("BackToTop", () => {
  it("renders with class", () => {
    const { container } = render(BackToTop, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".back-to-top");
    expect(el).toBeTruthy();
  });
});
