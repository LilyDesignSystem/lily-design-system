import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import MutuallyExclusive from "./MutuallyExclusive.vue";

describe("MutuallyExclusive", () => {
  it("renders with class", () => {
    const { container } = render(MutuallyExclusive, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".mutually-exclusive");
    expect(el).toBeTruthy();
  });
});
