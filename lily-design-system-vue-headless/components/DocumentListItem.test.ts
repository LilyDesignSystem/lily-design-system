import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import DocumentListItem from "./DocumentListItem.vue";

describe("DocumentListItem", () => {
  it("renders with class", () => {
    const { container } = render(DocumentListItem, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".document-list-item");
    expect(el).toBeTruthy();
  });
});
