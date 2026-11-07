// code-block.test.js
// CodeBlock component test

const path = require("path");

describe("CodeBlock", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "code-block.html"));
    });

    it("should render the pre element with correct class", async function () {
        const el = await $("pre.code-block");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("code-block");
    });

    it("should be a named region", async function () {
        const el = await $("pre.code-block");
        expect(await el.getAttribute("role")).toBe("region");
        expect(await el.getAttribute("aria-label")).not.toBe("");
    });
});
