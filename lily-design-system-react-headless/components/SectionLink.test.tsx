import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SectionLink from "./SectionLink";

describe("SectionLink", () => {
  it("renders with class", () => {
    const { container } = render(<SectionLink label="Test">content</SectionLink>);
    const el = container.querySelector(".section-link");
    expect(el).toBeTruthy();
  });
});
