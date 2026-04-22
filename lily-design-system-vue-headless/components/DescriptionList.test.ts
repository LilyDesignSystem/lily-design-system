import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import DescriptionList from "./DescriptionList.vue";

describe("DescriptionList", () => {
  it("renders with class", () => {
    const { container } = render(DescriptionList, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".description-list");
    expect(el).toBeTruthy();
  });
});
