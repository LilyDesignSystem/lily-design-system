import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("documentList macro", () => {
  it("renders the component", () => {
    const html = render("components/document-list/macro.njk", `
      {% from "components/document-list/macro.njk" import documentList %}
      {{ documentList({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("document-list");
  });
});
