import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SectionList from "./SectionList";

describe("SectionList", () => {
  it("renders with class", () => {
    const { container } = render(<SectionList label="Test">content</SectionList>);
    const el = container.querySelector(".section-list");
    expect(el).toBeTruthy();
  });
});
