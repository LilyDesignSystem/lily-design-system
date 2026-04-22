import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import DocumentListItem from "./DocumentListItem";

describe("DocumentListItem", () => {
  it("renders with class", () => {
    const { container } = render(<DocumentListItem label="Test">content</DocumentListItem>);
    const el = container.querySelector(".document-list-item");
    expect(el).toBeTruthy();
  });
});
