// tag-input-div.test.js
// TagInputDiv component test

const path = require("path");

describe("TagInputDiv", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tag-input-div.html"));
    });

    it("should render the div element with correct class and role", async function () {
        const el = await $("div.tag-input-div");
        await expect(el).toExist();
        expect(await el.getAttribute("role")).toBe("group");
    });

    it("should name the group and the field", async function () {
        expect(await (await $("div.tag-input-div")).getAttribute("aria-label")).toBe("Tags");
        expect(await (await $("input.tag-input-div-field")).getAttribute("aria-label")).toBe("Tags");
    });

    it("should add on Enter and clear the field", async function () {
        await browser.execute(function () {
            window.added = [];
            document.addEventListener("tag-input-div-add", function (event) {
                window.added.push(event.detail.value);
            });
        });
        const field = await $("input.tag-input-div-field");
        await field.setValue("  one  ");
        await browser.keys("Enter");
        expect(await browser.execute(() => window.added)).toEqual(["one"]);
        expect(await field.getValue()).toBe("");
    });

    it("should add nothing on Enter with blank text", async function () {
        await browser.execute(function () {
            window.added = [];
            document.addEventListener("tag-input-div-add", function (event) {
                window.added.push(event.detail.value);
            });
        });
        const field = await $("input.tag-input-div-field");
        await field.setValue("   ");
        await browser.keys("Enter");
        expect(await browser.execute(() => window.added)).toEqual([]);
    });
});
