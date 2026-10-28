// task-list.test.js
// TaskList component test

const path = require("path");

describe("TaskList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "task-list.html"));
    });

    it("should render the ol element with correct class", async function () {
        const el = await $("ol.task-list");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("task-list");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("ol.task-list");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
