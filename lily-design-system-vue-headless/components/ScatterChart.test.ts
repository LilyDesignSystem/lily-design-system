import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import ScatterChart from "./ScatterChart.vue";

describe("ScatterChart", () => {
  it("renders with class", () => {
    const { container } = render(ScatterChart, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".scatter-chart");
    expect(el).toBeTruthy();
  });
});
