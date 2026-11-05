// hamburger-menu.test.js
// HamburgerMenu component test

const path = require("path");

describe("HamburgerMenu", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "hamburger-menu.html"));
    });

    it("should render a div holding the button and the navigation", async function () {
        await expect($("div.hamburger-menu > button.hamburger-menu-button")).toExist();
        await expect($("div.hamburger-menu > nav.hamburger-menu-nav")).toExist();
    });

    it("should name the button and the navigation", async function () {
        expect(await $(".hamburger-menu-button").getAttribute("aria-label")).not.toBeNull();
        expect(await $(".hamburger-menu-nav").getAttribute("aria-label")).not.toBeNull();
    });

    it("should link the button to the navigation", async function () {
        const id = await $(".hamburger-menu-nav").getAttribute("id");
        expect(await $(".hamburger-menu-button").getAttribute("aria-controls")).toBe(id);
    });

    it("should start closed", async function () {
        expect(await $(".hamburger-menu-button").getAttribute("aria-expanded")).toBe("false");
        expect(await $(".hamburger-menu-nav").getProperty("hidden")).toBe(true);
    });

    it("should open and close on click", async function () {
        const button = await $(".hamburger-menu-button");
        await button.click();
        expect(await button.getAttribute("aria-expanded")).toBe("true");
        expect(await $(".hamburger-menu-nav").getProperty("hidden")).toBe(false);
        await button.click();
        expect(await button.getAttribute("aria-expanded")).toBe("false");
        expect(await $(".hamburger-menu-nav").getProperty("hidden")).toBe(true);
    });

    it("should open with the keyboard", async function () {
        await browser.execute(() => document.querySelector(".hamburger-menu-button").focus());
        await browser.keys("Enter");
        expect(await $(".hamburger-menu-nav").getProperty("hidden")).toBe(false);
    });
});
