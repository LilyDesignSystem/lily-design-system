// task-list-item.test.js
// TaskListItem component test

const path = require("path");

describe("TaskListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "task-list-item.html"));
    });

    it("should render the li element with correct class", async function () {
        const el = await $("li.task-list-item");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("task-list-item");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("li.task-list-item");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
