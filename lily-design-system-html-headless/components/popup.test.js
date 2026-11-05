// popup.test.js
// Popup component test

const path = require("path");

const file = path.resolve(__dirname, "popup.html");
const trigger = () => $('button[commandfor="popup-1"]');
const isOpen = () =>
    browser.execute(() => document.getElementById("popup-1").matches(":popover-open"));

describe("Popup", function () {
    beforeEach(async function () {
        await browser.url("file://" + file);
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.popup");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("popup");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.popup");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it('should be a popover="auto" dialog named by its trigger', async function () {
        const el = await $("div.popup");
        expect(await el.getAttribute("popover")).toBe("auto");
        expect(await el.getAttribute("role")).toBe("dialog");
        const t = await trigger();
        expect(await t.getAttribute("command")).toBe("toggle-popover");
        expect(await t.getAttribute("popovertarget")).toBe("popup-1");
    });

    it("should open from the trigger, close on Escape, and sync aria-expanded", async function () {
        const t = await trigger();
        expect(await isOpen()).toBe(false);
        await expect(t).toHaveAttribute("aria-expanded", "false");
        await t.click();
        expect(await isOpen()).toBe(true);
        await expect(t).toHaveAttribute("aria-expanded", "true");
        await browser.keys("Escape");
        expect(await isOpen()).toBe(false);
        await expect(t).toHaveAttribute("aria-expanded", "false");
    });

    it("should close on a click outside it (light dismiss)", async function () {
        await (await trigger()).click();
        expect(await isOpen()).toBe(true);
        await browser.execute(() => {
            const outside = document.createElement("p");
            outside.id = "outside";
            outside.textContent = "Outside";
            document.body.appendChild(outside);
        });
        await (await $("#outside")).click();
        expect(await isOpen()).toBe(false);
    });

    it("should open with no script at all", async function () {
        // Markup inserted with innerHTML runs no <script>: only command/commandfor and popovertarget work here.
        await browser.execute(() => {
            const markup = document.body.innerHTML.replace(/<script[\s\S]*?<\/script>/g, "");
            document.body.innerHTML = markup;
        });
        expect(await browser.execute(() => document.querySelectorAll("script").length)).toBe(0);
        await (await trigger()).click();
        expect(await isOpen()).toBe(true);
    });
});
