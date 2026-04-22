import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import DocumentList from "./DocumentList";

describe("DocumentList", () => {
  it("renders with class", () => {
    const { container } = render(<DocumentList label="Test">content</DocumentList>);
    const el = container.querySelector(".document-list");
    expect(el).toBeTruthy();
  });
});
