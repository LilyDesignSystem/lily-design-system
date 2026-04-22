const { describe, it, expect } = require("vitest");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("PhaseBanner", () => {
  it("renders the component", () => {
    const html = fs.readFileSync(path.resolve(__dirname, "phase-banner.html"), "utf8");
    const dom = new JSDOM(html);
    const el = dom.window.document.querySelector(".phase-banner");
    expect(el).toBeTruthy();
  });
});
