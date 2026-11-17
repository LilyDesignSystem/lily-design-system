// observation-view.test.js
// ObservationView component test

const path = require("path");

describe("ObservationView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "observation-view.html"));
    });

    it("renders a span with value, unit, flag and range as parts", async function () {
        const root = await $("span.observation-view");
        await expect(root).toExist();
        expect(await root.getAttribute("data-interpretation")).toBe("H");
        expect(await $(".observation-view-value").getText()).toBe("5.9");
        expect(await $(".observation-view-unit").getText()).toBe("mmol/L");
        expect(await $(".observation-view-flag").getText()).toBe("High");
        const ranges = await $$(".observation-view-range");
        expect(await ranges[0].getText()).toBe("3.5–5.3");
        expect(await ranges[1].getText()).toBe("Critical above 6.5");
    });

    it("names the observation with hidden text, not aria-label", async function () {
        expect(await $("span.observation-view").getAttribute("aria-label")).toBeNull();
        await expect($(".observation-view .screen-reader-span")).toExist();
    });
});
