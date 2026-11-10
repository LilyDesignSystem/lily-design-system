// editable.test.js
// Editable component test

const path = require("path");

describe("Editable", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "editable.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.editable");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("editable");
    });

    it("holds a native button named by the value and the label", async function () {
        const button = await $("div.editable > button.editable-button");
        expect(await button.getAttribute("type")).toBe("button");
        expect(await button.getAttribute("aria-label")).toBe("Draft title, Title");
        expect(await button.getAttribute("role")).toBeNull();
    });
});

// Keyboard behaviour (P12-T4): real key presses in a real browser.
describe("Editable keyboard", function () {
    const activeTag = () => browser.execute(() => document.activeElement.tagName);
    const text = () =>
        browser.execute(() => document.querySelector(".editable-button").textContent.trim());
    async function setup() {
        await browser.url("file://" + path.resolve(__dirname, "editable.html"));
        await browser.execute(() => {
            window.__changes = [];
            document.addEventListener("editable-change", (e) =>
                window.__changes.push(e.detail && e.detail.value),
            );
            document.querySelector(".editable-button").focus();
        });
    }
    it("Enter on the button swaps in the field and moves focus into it", async function () {
        await setup();
        await browser.keys("Enter");
        expect(await activeTag()).toBe("INPUT");
        expect(await browser.execute(() => document.activeElement.value)).toBe("Draft title");
    });
    it("a click starts editing", async function () {
        await setup();
        await (await $(".editable-button")).click();
        expect(await activeTag()).toBe("INPUT");
    });
    it("Space also starts editing", async function () {
        await setup();
        await browser.keys(" ");
        expect(await activeTag()).toBe("INPUT");
    });
    it("Enter in the field confirms the new value and returns focus to the button", async function () {
        await setup();
        await browser.keys("Enter");
        await browser.execute(() => document.activeElement.select());
        await browser.keys("new");
        await browser.keys("Enter");
        expect(await text()).toBe("new");
        expect(await browser.execute(() => document.activeElement.className)).toBe(
            "editable-button",
        );
        expect(await browser.execute(() => window.__changes)).toEqual(["new"]);
        expect(await $(".editable-button").getAttribute("aria-label")).toBe("new, Title");
    });
    it("Escape cancels and keeps the old value", async function () {
        await setup();
        await browser.keys("Enter");
        await browser.keys("zzz");
        await browser.keys("Escape");
        expect(await text()).toBe("Draft title");
        expect(await browser.execute(() => document.querySelector(".editable-input").hidden)).toBe(
            true,
        );
    });
    it("a disabled button blocks editing", async function () {
        await setup();
        await browser.execute(() => (document.querySelector(".editable-button").disabled = true));
        await browser.execute(() => document.querySelector(".editable-button").click());
        expect(await browser.execute(() => document.querySelector(".editable-input").hidden)).toBe(
            true,
        );
    });
});
