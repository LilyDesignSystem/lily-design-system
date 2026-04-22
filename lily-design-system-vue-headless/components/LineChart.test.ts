import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import LineChart from "./LineChart.vue";

describe("LineChart", () => {
  it("renders with class", () => {
    const { container } = render(LineChart, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".line-chart");
    expect(el).toBeTruthy();
  });
});
