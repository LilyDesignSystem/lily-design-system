import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import PhaseBanner from "./PhaseBanner.vue";

describe("PhaseBanner", () => {
  it("renders with class", () => {
    const { container } = render(PhaseBanner, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".phase-banner");
    expect(el).toBeTruthy();
  });
});
