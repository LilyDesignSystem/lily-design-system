import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import AddressInput from "./AddressInput";

describe("AddressInput", () => {
  it("renders with class", () => {
    const { container } = render(<AddressInput label="Test">content</AddressInput>);
    const el = container.querySelector(".address-input");
    expect(el).toBeTruthy();
  });
});
