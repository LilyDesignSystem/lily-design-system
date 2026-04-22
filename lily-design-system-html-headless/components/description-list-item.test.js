const { describe, it, expect } = require("vitest");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("DescriptionListItem", () => {
  it("renders the component", () => {
    const html = fs.readFileSync(path.resolve(__dirname, "description-list-item.html"), "utf8");
    const dom = new JSDOM(html);
    const el = dom.window.document.querySelector(".description-list-item");
    expect(el).toBeTruthy();
  });
});
