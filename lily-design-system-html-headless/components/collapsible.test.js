// collapsible.test.js
// Collapsible component test

const path = require("path");

describe("Collapsible", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "collapsible.html"));
    });

    it("should render a native details with a summary", async function () {
        await expect($("details.collapsible > summary.collapsible-summary")).toExist();
        await expect($("details.collapsible > .collapsible-body")).toExist();
    });

    it("should start closed", async function () {
        expect(await $("details.collapsible").getProperty("open")).toBe(false);
    });

    it("should toggle on click", async function () {
        const summary = await $(".collapsible-summary");
        await summary.click();
        expect(await $("details.collapsible").getProperty("open")).toBe(true);
        await summary.click();
        expect(await $("details.collapsible").getProperty("open")).toBe(false);
    });

    it("should toggle with the keyboard", async function () {
        await browser.execute(() => document.querySelector(".collapsible-summary").focus());
        await browser.keys("Enter");
        expect(await $("details.collapsible").getProperty("open")).toBe(true);
    });
});
