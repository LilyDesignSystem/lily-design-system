import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import AreaChart from "./AreaChart";

describe("AreaChart", () => {
  it("renders with class", () => {
    const { container } = render(<AreaChart label="Test">content</AreaChart>);
    const el = container.querySelector(".area-chart");
    expect(el).toBeTruthy();
  });
});
