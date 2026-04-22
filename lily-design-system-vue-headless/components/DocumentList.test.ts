import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import DocumentList from "./DocumentList.vue";

describe("DocumentList", () => {
  it("renders with class", () => {
    const { container } = render(DocumentList, {
      props: { label: "Test" },
      slots: { default: "content" },
    });
    const el = container.querySelector(".document-list");
    expect(el).toBeTruthy();
  });
});
