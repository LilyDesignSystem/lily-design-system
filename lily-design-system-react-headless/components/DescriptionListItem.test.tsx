import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import DescriptionListItem from "./DescriptionListItem";

describe("DescriptionListItem", () => {
  it("renders with class", () => {
    const { container } = render(<DescriptionListItem label="Test">content</DescriptionListItem>);
    const el = container.querySelector(".description-list-item");
    expect(el).toBeTruthy();
  });
});
