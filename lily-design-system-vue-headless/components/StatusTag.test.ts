import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import StatusTag from "./StatusTag.vue";

describe("StatusTag", () => {
  it("renders with class", () => {
    const { container } = render(StatusTag, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".status-tag");
    expect(el).toBeTruthy();
  });
});
