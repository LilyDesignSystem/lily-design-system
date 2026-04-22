import { describe, it, expect } from "vitest";
import render from "../../test/render.js";

describe("timeoutDialog macro", () => {
  it("renders the component", () => {
    const html = render("components/timeout-dialog/macro.njk", `
      {% from "components/timeout-dialog/macro.njk" import timeoutDialog %}
      {{ timeoutDialog({ label: "Test", text: "Content" }) }}
    `);
    expect(html).toContain("timeout-dialog");
  });
});
