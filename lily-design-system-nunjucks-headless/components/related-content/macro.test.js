import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("relatedContent macro", () => {
  it("renders the component", () => {
    const html = render("components/related-content/macro.njk", `
      {% from "components/related-content/macro.njk" import relatedContent %}
      {{ relatedContent({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("related-content");
  });
});
