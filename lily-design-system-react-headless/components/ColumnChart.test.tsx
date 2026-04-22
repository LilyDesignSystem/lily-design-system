import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ColumnChart from "./ColumnChart";

describe("ColumnChart", () => {
  it("renders with class", () => {
    const { container } = render(<ColumnChart label="Test">content</ColumnChart>);
    const el = container.querySelector(".column-chart");
    expect(el).toBeTruthy();
  });
});
