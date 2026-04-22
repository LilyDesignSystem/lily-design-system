import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SuccessPanel from "./SuccessPanel";

describe("SuccessPanel", () => {
  it("renders with class", () => {
    const { container } = render(<SuccessPanel label="Test">content</SuccessPanel>);
    const el = container.querySelector(".success-panel");
    expect(el).toBeTruthy();
  });
});
