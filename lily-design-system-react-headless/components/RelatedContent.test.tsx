import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import RelatedContent from "./RelatedContent";

describe("RelatedContent", () => {
  it("renders with class", () => {
    const { container } = render(<RelatedContent label="Test">content</RelatedContent>);
    const el = container.querySelector(".related-content");
    expect(el).toBeTruthy();
  });
});
