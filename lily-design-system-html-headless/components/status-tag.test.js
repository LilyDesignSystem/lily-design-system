const { describe, it, expect } = require("vitest");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("StatusTag", () => {
  it("renders the component", () => {
    const html = fs.readFileSync(path.resolve(__dirname, "status-tag.html"), "utf8");
    const dom = new JSDOM(html);
    const el = dom.window.document.querySelector(".status-tag");
    expect(el).toBeTruthy();
  });
});
