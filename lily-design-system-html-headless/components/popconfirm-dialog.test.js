// popconfirm-dialog.test.js
// PopconfirmDialog component test

const path = require("path");

const isOpen = () =>
    browser.execute(() =>
        document.querySelector("div.popconfirm-dialog").matches(":popover-open"),
    );

describe("PopconfirmDialog", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "popconfirm-dialog.html"));
    });

    it("should render a div with the popconfirm-dialog class", async function () {
        const el = await $("div.popconfirm-dialog");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("popconfirm-dialog");
    });

    it('should have role="alertdialog"', async function () {
        const el = await $("div.popconfirm-dialog");
        const role = await el.getAttribute("role");
        expect(role).toBe("alertdialog");
    });

    it('should set aria-modal="false" (popconfirm is non-modal)', async function () {
        const el = await $("div.popconfirm-dialog");
        const ariaModal = await el.getAttribute("aria-modal");
        expect(ariaModal).toBe("false");
    });

    it("should reference the title and description via aria-labelledby and aria-describedby", async function () {
        const el = await $("div.popconfirm-dialog");
        const labelledBy = await el.getAttribute("aria-labelledby");
        const describedBy = await el.getAttribute("aria-describedby");
        expect(labelledBy).not.toBeNull();
        expect(describedBy).not.toBeNull();
    });

    it("should contain title, cancel, and confirm elements", async function () {
        const title = await $("h2.popconfirm-dialog-title");
        const cancel = await $("button.popconfirm-dialog-cancel");
        const confirm = await $("button.popconfirm-dialog-confirm");
        await expect(title).toExist();
        await expect(cancel).toExist();
        await expect(confirm).toExist();
    });

    it("should be hidden by default", async function () {
        expect(await isOpen()).toBe(false);
    });

    it("should hide the dialog after the cancel button is clicked", async function () {
        // Reveal first so the buttons are clickable in the test browser.
        await browser.execute(function () {
            document.querySelector("div.popconfirm-dialog").showPopover();
        });
        const cancel = await $("button.popconfirm-dialog-cancel");
        await cancel.click();
        expect(await isOpen()).toBe(false);
    });

    it("should hide the dialog after the confirm button is clicked", async function () {
        await browser.execute(function () {
            document.querySelector("div.popconfirm-dialog").showPopover();
        });
        const confirm = await $("button.popconfirm-dialog-confirm");
        await confirm.click();
        expect(await isOpen()).toBe(false);
    });
});
