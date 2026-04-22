const { describe, it, expect } = require("vitest");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("DocumentList", () => {
  it("renders the component", () => {
    const html = fs.readFileSync(path.resolve(__dirname, "document-list.html"), "utf8");
    const dom = new JSDOM(html);
    const el = dom.window.document.querySelector(".document-list");
    expect(el).toBeTruthy();
  });
});
