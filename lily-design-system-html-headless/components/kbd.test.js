// kbd.test.js
// Kbd component test

const path = require("path");

describe("Kbd", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "kbd.html"));
    });

    it("should render the kbd element with correct class", async function () {
        const el = await $("kbd.kbd");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("kbd");
    });

    it("should give the spoken form as hidden text, and hide the key", async function () {
        expect(await (await $("kbd.kbd")).getAttribute("aria-label")).toBeNull();
        expect(await (await $("kbd.kbd .screen-reader-span")).isExisting()).toBe(true);
        expect(await (await $("kbd.kbd .kbd-text")).getAttribute("aria-hidden")).toBe("true");
    });
});
