import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("documentListItem macro", () => {
  it("renders the component", () => {
    const html = render("components/document-list-item/macro.njk", `
      {% from "components/document-list-item/macro.njk" import documentListItem %}
      {{ documentListItem({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("document-list-item");
  });
});
