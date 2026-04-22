import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SharePage from "./SharePage";

describe("SharePage", () => {
  it("renders with class", () => {
    const { container } = render(<SharePage label="Test">content</SharePage>);
    const el = container.querySelector(".share-page");
    expect(el).toBeTruthy();
  });
});
