import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import Autosuggest from "./Autosuggest.vue";

describe("Autosuggest", () => {
  it("renders with class", () => {
    const { container } = render(Autosuggest, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".autosuggest");
    expect(el).toBeTruthy();
  });
});
