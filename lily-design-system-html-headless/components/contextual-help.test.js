// contextual-help.test.js
// ContextualHelp component test

const path = require("path");

const isOpen = () =>
    browser.execute(() => document.querySelector(".contextual-help-panel").matches(":popover-open"));

describe("ContextualHelp", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "contextual-help.html"));
    });

    it("should render the root element with correct class", async function () {
        const el = await $("div.contextual-help");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("contextual-help");
    });

    it('should have a trigger with aria-haspopup="dialog"', async function () {
        const trigger = await $("button.contextual-help-trigger");
        await expect(trigger).toExist();
        expect(await trigger.getAttribute("aria-haspopup")).toBe("dialog");
    });

    it("should have a trigger with aria-expanded, aria-controls and commandfor", async function () {
        const trigger = await $("button.contextual-help-trigger");
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
        const controls = await trigger.getAttribute("aria-controls");
        expect(controls).not.toBeNull();
        expect(await trigger.getAttribute("command")).toBe("toggle-popover");
        expect(await trigger.getAttribute("commandfor")).toBe(controls);
        expect(await trigger.getAttribute("popovertarget")).toBe(controls);
    });

    it('should render the panel with role="dialog" and popover="auto"', async function () {
        const panel = await $("div.contextual-help-panel");
        await expect(panel).toExist();
        expect(await panel.getAttribute("role")).toBe("dialog");
        expect(await panel.getAttribute("popover")).toBe("auto");
    });

    it("should toggle the panel and aria-expanded on trigger click", async function () {
        const trigger = await $("button.contextual-help-trigger");

        expect(await isOpen()).toBe(false);
        await trigger.click();
        expect(await isOpen()).toBe(true);
        await expect(trigger).toHaveAttribute("aria-expanded", "true");

        await trigger.click();
        expect(await isOpen()).toBe(false);
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("should close on Escape and on a click outside it", async function () {
        const trigger = await $("button.contextual-help-trigger");
        await trigger.click();
        await browser.keys("Escape");
        expect(await isOpen()).toBe(false);

        await trigger.click();
        expect(await isOpen()).toBe(true);
        await browser.execute(() => {
            const outside = document.createElement("p");
            outside.id = "outside";
            outside.textContent = "Outside";
            document.body.appendChild(outside);
        });
        await (await $("#outside")).click();
        expect(await isOpen()).toBe(false);
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("should open with no script at all", async function () {
        // Markup inserted with innerHTML runs no <script>: only command/commandfor and popovertarget work here.
        await browser.execute(() => {
            document.body.innerHTML = document.body.innerHTML.replace(/<script[\s\S]*?<\/script>/g, "");
        });
        await (await $("button.contextual-help-trigger")).click();
        expect(await isOpen()).toBe(true);
    });
});
