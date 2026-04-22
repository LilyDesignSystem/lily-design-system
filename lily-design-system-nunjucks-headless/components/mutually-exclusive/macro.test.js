import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("mutuallyExclusive macro", () => {
  it("renders the component", () => {
    const html = render("components/mutually-exclusive/macro.njk", `
      {% from "components/mutually-exclusive/macro.njk" import mutuallyExclusive %}
      {{ mutuallyExclusive({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("mutually-exclusive");
  });
});
