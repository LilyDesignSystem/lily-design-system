import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import MutuallyExclusive from "./MutuallyExclusive";

describe("MutuallyExclusive", () => {
  it("renders with class", () => {
    const { container } = render(<MutuallyExclusive label="Test">content</MutuallyExclusive>);
    const el = container.querySelector(".mutually-exclusive");
    expect(el).toBeTruthy();
  });
});
