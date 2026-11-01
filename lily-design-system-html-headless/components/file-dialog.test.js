// file-dialog.test.js
// FileDialog component test

const path = require("path");

describe("FileDialog", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "file-dialog.html"));
    });

    it("should render the dialog element with correct class", async function () {
        const el = await $("dialog.file-dialog");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("file-dialog");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("dialog.file-dialog");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Modality (tasks.md P14-T4), in a real browser: opened with showModal() the dialog is modal (:modal), focus moves
// inside, Escape closes it, and focus returns to the button that opened it.
describe("FileDialog modality", function () {
    it("showModal() makes it modal; Escape closes it and focus returns to the opener", async function () {
        await browser.url("file://" + path.resolve(__dirname, "file-dialog.html"));
        await browser.execute(() => {
            const dialog = document.querySelector(".file-dialog");
            dialog.insertAdjacentHTML("beforeend", '<button id="inside">Inside</button>');
            const opener = document.createElement("button");
            opener.id = "opener";
            opener.textContent = "Open";
            opener.addEventListener("click", () => dialog.showModal());
            document.body.prepend(opener);
        });
        await (await $("#opener")).click();
        const state = () =>
            browser.execute(() => {
                const d = document.querySelector(".file-dialog");
                return {
                    open: d.open,
                    modal: d.matches(":modal"),
                    active: document.activeElement.id,
                };
            });
        expect(await state()).toEqual({ open: true, modal: true, active: "inside" });
        await browser.keys("Escape");
        await browser.waitUntil(async () => (await state()).open === false, { timeout: 2000 });
        expect((await state()).active).toBe("opener");
    });
});
