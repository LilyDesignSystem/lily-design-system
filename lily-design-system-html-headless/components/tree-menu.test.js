// tree-menu.test.js
// TreeMenu component test

const path = require("path");

describe("TreeMenu", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tree-menu.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.tree-menu");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tree-menu");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.tree-menu");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("tree");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.tree-menu");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    async function addItems() {
        await browser.execute(function () {
            var root = document.querySelector("div.tree-menu");
            root.setAttribute("aria-label", "Site");
            root.innerHTML =
                '<ul><li role="treeitem" tabindex="-1">Home</li><li role="treeitem" tabindex="-1">Settings</li><li role="treeitem" tabindex="-1">Profile</li></ul>';
            root.querySelector('[role="treeitem"]').focus();
        });
    }
    const focused = () => browser.execute(() => document.activeElement.textContent);

    it("ArrowDown and ArrowUp move focus between tree items and wrap at the ends", async function () {
        await addItems();
        await browser.keys("ArrowDown");
        expect(await focused()).toBe("Settings");
        await browser.keys("ArrowUp");
        expect(await focused()).toBe("Home");
        await browser.keys("ArrowUp");
        expect(await focused()).toBe("Profile");
        await browser.keys("ArrowDown");
        expect(await focused()).toBe("Home");
    });

    it("Home and End jump to the first and last tree item", async function () {
        await addItems();
        await browser.keys("End");
        expect(await focused()).toBe("Profile");
        await browser.keys("Home");
        expect(await focused()).toBe("Home");
    });
});
