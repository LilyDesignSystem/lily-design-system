const { describe, it, expect } = require("vitest");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("SectionNav", () => {
  it("renders the component", () => {
    const html = fs.readFileSync(path.resolve(__dirname, "section-nav.html"), "utf8");
    const dom = new JSDOM(html);
    const el = dom.window.document.querySelector(".section-nav");
    expect(el).toBeTruthy();
  });
});
