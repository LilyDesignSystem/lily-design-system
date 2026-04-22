const { describe, it, expect } = require("vitest");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("AreaChart", () => {
  it("renders the component", () => {
    const html = fs.readFileSync(path.resolve(__dirname, "area-chart.html"), "utf8");
    const dom = new JSDOM(html);
    const el = dom.window.document.querySelector(".area-chart");
    expect(el).toBeTruthy();
  });
});
