import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import SuccessPanel from "./SuccessPanel.vue";

describe("SuccessPanel", () => {
  it("renders with class", () => {
    const { container } = render(SuccessPanel, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".success-panel");
    expect(el).toBeTruthy();
  });
});
