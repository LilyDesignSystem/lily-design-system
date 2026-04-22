import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import AreaChart from "./AreaChart.vue";

describe("AreaChart", () => {
  it("renders with class", () => {
    const { container } = render(AreaChart, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".area-chart");
    expect(el).toBeTruthy();
  });
});
