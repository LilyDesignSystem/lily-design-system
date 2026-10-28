// task-bar.test.js
// TaskBar component test

const path = require("path");

describe("TaskBar", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "task-bar.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.task-bar");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("task-bar");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.task-bar");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
