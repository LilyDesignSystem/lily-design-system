import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ScatterChart from "./ScatterChart";

describe("ScatterChart", () => {
  it("renders with class", () => {
    const { container } = render(<ScatterChart label="Test">content</ScatterChart>);
    const el = container.querySelector(".scatter-chart");
    expect(el).toBeTruthy();
  });
});
