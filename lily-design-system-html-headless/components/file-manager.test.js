// file-manager.test.js
// FileManager component test

const path = require("path");

describe("FileManager", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "file-manager.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.file-manager");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("file-manager");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.file-manager");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
