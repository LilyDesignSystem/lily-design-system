// hero-headline.test.js
// HeroHeadline component test

const path = require("path");

describe("HeroHeadline", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "hero-headline.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.hero-headline");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("hero-headline");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.hero-headline");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should be a group, so that its label is valid", async function () {
        const el = await $("div.hero-headline");
        expect(await el.getAttribute("role")).toBe("group");
    });
});
