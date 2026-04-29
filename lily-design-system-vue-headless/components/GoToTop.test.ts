import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import GoToTop from "./GoToTop.vue";

describe("GoToTop", () => {
  it("renders with class", () => {
    const { container } = render(GoToTop, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".go-to-top");
    expect(el).toBeTruthy();
  });
});
