// file-upload.test.js
// FileUpload component test

const path = require("path");

describe("FileUpload", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "file-upload.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.file-upload");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("file-upload");
    });
});
