import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("autosuggest macro", () => {
  it("renders the component", () => {
    const html = render("components/autosuggest/macro.njk", `
      {% from "components/autosuggest/macro.njk" import autosuggest %}
      {{ autosuggest({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("autosuggest");
  });
});
