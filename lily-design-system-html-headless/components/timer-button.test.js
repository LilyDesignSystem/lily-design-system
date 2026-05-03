// timer-button.test.js
// TimerButton component test

const path = require("path");

describe("TimerButton", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "timer-button.html"),
    );
  });

  it("should render the button element with correct class", async function () {
    const el = await $("button.timer-button");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("timer-button");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("button.timer-button");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
