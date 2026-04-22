import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import StatusTag from "./StatusTag";

describe("StatusTag", () => {
  it("renders with class", () => {
    const { container } = render(<StatusTag label="Test">content</StatusTag>);
    const el = container.querySelector(".status-tag");
    expect(el).toBeTruthy();
  });
});
