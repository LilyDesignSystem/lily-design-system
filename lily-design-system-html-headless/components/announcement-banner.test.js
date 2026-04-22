const { describe, it, expect } = require("vitest");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("AnnouncementBanner", () => {
  it("renders the component", () => {
    const html = fs.readFileSync(path.resolve(__dirname, "announcement-banner.html"), "utf8");
    const dom = new JSDOM(html);
    const el = dom.window.document.querySelector(".announcement-banner");
    expect(el).toBeTruthy();
  });
});
