const { describe, it, expect } = require("vitest");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("SuccessPanel", () => {
  it("renders the component", () => {
    const html = fs.readFileSync(path.resolve(__dirname, "success-panel.html"), "utf8");
    const dom = new JSDOM(html);
    const el = dom.window.document.querySelector(".success-panel");
    expect(el).toBeTruthy();
  });
});
