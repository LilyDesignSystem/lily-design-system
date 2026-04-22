import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SectionListItem from "./SectionListItem";

describe("SectionListItem", () => {
  it("renders with class", () => {
    const { container } = render(<SectionListItem label="Test">content</SectionListItem>);
    const el = container.querySelector(".section-list-item");
    expect(el).toBeTruthy();
  });
});
