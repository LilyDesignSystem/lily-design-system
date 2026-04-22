import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import TimeoutDialog from "./TimeoutDialog.vue";

describe("TimeoutDialog", () => {
  it("renders with class", () => {
    const { container } = render(TimeoutDialog, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".timeout-dialog");
    expect(el).toBeTruthy();
  });
});
