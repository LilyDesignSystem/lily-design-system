import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import BarChart from "./BarChart.vue";

describe("BarChart", () => {
  it("renders with class", () => {
    const { container } = render(BarChart, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".bar-chart");
    expect(el).toBeTruthy();
  });
});
