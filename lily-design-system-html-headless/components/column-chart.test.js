const { describe, it, expect } = require("vitest");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("ColumnChart", () => {
  it("renders the component", () => {
    const html = fs.readFileSync(path.resolve(__dirname, "column-chart.html"), "utf8");
    const dom = new JSDOM(html);
    const el = dom.window.document.querySelector(".column-chart");
    expect(el).toBeTruthy();
  });
});
