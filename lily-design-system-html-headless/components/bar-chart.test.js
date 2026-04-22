const { describe, it, expect } = require("vitest");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("BarChart", () => {
  it("renders the component", () => {
    const html = fs.readFileSync(path.resolve(__dirname, "bar-chart.html"), "utf8");
    const dom = new JSDOM(html);
    const el = dom.window.document.querySelector(".bar-chart");
    expect(el).toBeTruthy();
  });
});
