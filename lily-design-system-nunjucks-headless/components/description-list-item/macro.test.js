import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("descriptionListItem macro", () => {
  it("renders the component", () => {
    const html = render("components/description-list-item/macro.njk", `
      {% from "components/description-list-item/macro.njk" import descriptionListItem %}
      {{ descriptionListItem({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("description-list-item");
  });
});
