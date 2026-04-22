import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Autosuggest from "./Autosuggest";

describe("Autosuggest", () => {
  it("renders with class", () => {
    const { container } = render(<Autosuggest label="Test">content</Autosuggest>);
    const el = container.querySelector(".autosuggest");
    expect(el).toBeTruthy();
  });
});
