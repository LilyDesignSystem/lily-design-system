// malaysia-kad-pengenalan-input.test.js
// MalaysiaKadPengenalanInput component test

const path = require("path");

describe("MalaysiaKadPengenalanInput", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "malaysia-kad-pengenalan-input.html"),
        );
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.malaysia-kad-pengenalan-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("malaysia-kad-pengenalan-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.malaysia-kad-pengenalan-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should have autocomplete off", async function () {
        const el = await $("input.malaysia-kad-pengenalan-input");
        const value = await el.getAttribute("autocomplete");
        expect(value).toBe("off");
    });
});
