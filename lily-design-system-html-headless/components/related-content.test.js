const { describe, it, expect } = require("vitest");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("RelatedContent", () => {
  it("renders the component", () => {
    const html = fs.readFileSync(path.resolve(__dirname, "related-content.html"), "utf8");
    const dom = new JSDOM(html);
    const el = dom.window.document.querySelector(".related-content");
    expect(el).toBeTruthy();
  });
});
