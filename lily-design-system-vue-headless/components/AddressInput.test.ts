import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import AddressInput from "./AddressInput.vue";

describe("AddressInput", () => {
  it("renders with class", () => {
    const { container } = render(AddressInput, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".address-input");
    expect(el).toBeTruthy();
  });
});
