// warning-text.test.js
// WarningText component test

const path = require("path");

describe("WarningText", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "warning-text.html"));
    });

    it("should render a div with the base class as its first class", async function () {
        const el = await $("div.warning-text");
        await expect(el).toExist();
        expect((await el.getAttribute("class")).split(" ")[0]).toBe("warning-text");
    });

    it("should hide the icon from assistive technology", async function () {
        const icon = await $(".warning-text > .warning-text-icon");
        await expect(icon).toExist();
        expect(await icon.getAttribute("aria-hidden")).toBe("true");
    });

    it("should hold the hidden prefix and the text in strong.warning-text-text", async function () {
        const strong = await $(".warning-text > strong.warning-text-text");
        await expect(strong).toExist();
        await expect(strong.$(".visually-hidden")).toExist();
    });

    it("should have no role and no inline styles", async function () {
        const el = await $("div.warning-text");
        expect(await el.getAttribute("role")).toBeNull();
        expect(await el.getAttribute("style")).toBeNull();
    });
});
