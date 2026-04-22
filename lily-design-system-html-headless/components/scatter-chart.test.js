const { describe, it, expect } = require("vitest");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("ScatterChart", () => {
  it("renders the component", () => {
    const html = fs.readFileSync(path.resolve(__dirname, "scatter-chart.html"), "utf8");
    const dom = new JSDOM(html);
    const el = dom.window.document.querySelector(".scatter-chart");
    expect(el).toBeTruthy();
  });
});
