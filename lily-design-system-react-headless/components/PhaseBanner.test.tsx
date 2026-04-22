import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import PhaseBanner from "./PhaseBanner";

describe("PhaseBanner", () => {
  it("renders with class", () => {
    const { container } = render(<PhaseBanner label="Test">content</PhaseBanner>);
    const el = container.querySelector(".phase-banner");
    expect(el).toBeTruthy();
  });
});
