const { describe, it, expect } = require("vitest");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("BackToTop", () => {
  it("renders the component", () => {
    const html = fs.readFileSync(path.resolve(__dirname, "back-to-top.html"), "utf8");
    const dom = new JSDOM(html);
    const el = dom.window.document.querySelector(".back-to-top");
    expect(el).toBeTruthy();
  });
});
