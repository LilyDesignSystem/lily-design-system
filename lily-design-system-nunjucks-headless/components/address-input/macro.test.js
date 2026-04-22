import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("addressInput macro", () => {
  it("renders the component", () => {
    const html = render("components/address-input/macro.njk", `
      {% from "components/address-input/macro.njk" import addressInput %}
      {{ addressInput({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("address-input");
  });
});
