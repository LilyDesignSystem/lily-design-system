import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import LineChart from "./LineChart";

describe("LineChart", () => {
  it("renders with class", () => {
    const { container } = render(<LineChart label="Test">content</LineChart>);
    const el = container.querySelector(".line-chart");
    expect(el).toBeTruthy();
  });
});
