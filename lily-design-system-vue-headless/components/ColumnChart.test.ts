import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import ColumnChart from "./ColumnChart.vue";

describe("ColumnChart", () => {
  it("renders with class", () => {
    const { container } = render(ColumnChart, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".column-chart");
    expect(el).toBeTruthy();
  });
});
