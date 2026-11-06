// question.test.js
// Question component test

const path = require("path");

describe("Question", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "question.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.question");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("question");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.question");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should be a group, so that its label is valid", async function () {
        const el = await $(".question");
        expect(await el.getAttribute("role")).toBe("group");
    });
});
