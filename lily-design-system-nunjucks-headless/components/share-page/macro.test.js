import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("sharePage macro", () => {
  it("renders the component", () => {
    const html = render("components/share-page/macro.njk", `
      {% from "components/share-page/macro.njk" import sharePage %}
      {{ sharePage({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("share-page");
  });
});
