import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import BackToTop from "./BackToTop";

describe("BackToTop", () => {
  it("renders with class", () => {
    const { container } = render(<BackToTop label="Test">content</BackToTop>);
    const el = container.querySelector(".back-to-top");
    expect(el).toBeTruthy();
  });
});
