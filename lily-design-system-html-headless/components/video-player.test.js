// video-player.test.js
// VideoPlayer component test

const path = require("path");

describe("VideoPlayer", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "video-player.html"));
    });

    it("should render the figure element with correct class", async function () {
        const el = await $("figure.video-player");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("video-player");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("figure.video-player");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should caption the video with a figcaption", async function () {
        await expect(await $("figure.video-player > figcaption.video-player-caption")).toExist();
    });
});
