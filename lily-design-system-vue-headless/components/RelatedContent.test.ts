import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import RelatedContent from "./RelatedContent.vue";

describe("RelatedContent", () => {
  it("renders with class", () => {
    const { container } = render(RelatedContent, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".related-content");
    expect(el).toBeTruthy();
  });
});
