import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SectionNav from "./SectionNav";

describe("SectionNav", () => {
  it("renders with class", () => {
    const { container } = render(<SectionNav label="Test">content</SectionNav>);
    const el = container.querySelector(".section-nav");
    expect(el).toBeTruthy();
  });
});
