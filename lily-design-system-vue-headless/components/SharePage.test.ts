import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import SharePage from "./SharePage.vue";

describe("SharePage", () => {
  it("renders with class", () => {
    const { container } = render(SharePage, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".share-page");
    expect(el).toBeTruthy();
  });
});
