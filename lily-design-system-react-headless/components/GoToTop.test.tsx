import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import GoToTop from "./GoToTop";

describe("GoToTop", () => {
  it("renders with class", () => {
    const { container } = render(<GoToTop label="Test">content</GoToTop>);
    const el = container.querySelector(".go-to-top");
    expect(el).toBeTruthy();
  });
});
