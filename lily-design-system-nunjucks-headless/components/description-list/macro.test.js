import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("descriptionList macro", () => {
  it("renders the component", () => {
    const html = render("components/description-list/macro.njk", `
      {% from "components/description-list/macro.njk" import descriptionList %}
      {{ descriptionList({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("description-list");
  });
});
