import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import DescriptionList from "./DescriptionList";

describe("DescriptionList", () => {
  it("renders with class", () => {
    const { container } = render(<DescriptionList label="Test">content</DescriptionList>);
    const el = container.querySelector(".description-list");
    expect(el).toBeTruthy();
  });
});
