// task-bar-button.test.js
// TaskBarButton component test

const path = require("path");

describe("TaskBarButton", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "task-bar-button.html"));
    });

    it("should render the button element with correct class", async function () {
        const el = await $("button.task-bar-button");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("task-bar-button");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("button.task-bar-button");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
