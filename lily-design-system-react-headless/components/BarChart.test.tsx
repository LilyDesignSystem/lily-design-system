import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import BarChart from "./BarChart";

describe("BarChart", () => {
  it("renders with class", () => {
    const { container } = render(<BarChart label="Test">content</BarChart>);
    const el = container.querySelector(".bar-chart");
    expect(el).toBeTruthy();
  });
});
