// tabbed-interface.test.js
// Tabbed Interface page test

const path = require("path");

describe("Tabbed Interface", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" +
        path.resolve(__dirname, "..", "pages", "tabbed-interface.html"),
    );
  });

  it("should render the tab bar with correct role", async function () {
    const el = await $("div.tab-bar");
    await expect(el).toExist();
    const role = await el.getAttribute("role");
    expect(role).toBe("tablist");
  });

  it("should render tab buttons", async function () {
    const tabs = await $$("button.tab-bar-button");
    expect(tabs.length).toBe(2);
    const role = await tabs[0].getAttribute("role");
    expect(role).toBe("tab");
  });

  it("should have the All tab selected by default", async function () {
    const allTab = await $("button#tab-all");
    const selected = await allTab.getAttribute("aria-selected");
    expect(selected).toBe("true");
  });

  it("should render the all panel visible by default", async function () {
    const allPanel = await $("div#all-panel");
    const hidden = await allPanel.getAttribute("hidden");
    expect(hidden).toBeNull();
  });

  it("should render the unread panel hidden by default", async function () {
    const unreadPanel = await $("div#unread-panel");
    const hidden = await unreadPanel.getAttribute("hidden");
    expect(hidden).not.toBeNull();
  });

  it("should switch to unread tab on click", async function () {
    await $("button#tab-unread").click();
    const unreadPanel = await $("div#unread-panel");
    const hidden = await unreadPanel.getAttribute("hidden");
    expect(hidden).toBeNull();
    const allPanel = await $("div#all-panel");
    const allHidden = await allPanel.getAttribute("hidden");
    expect(allHidden).not.toBeNull();
  });

  it("should render accordion nav", async function () {
    const el = await $("nav.accordion-nav");
    await expect(el).toExist();
  });

  it("should render accordion list items", async function () {
    const items = await $$("#all-panel li.accordion-list-item");
    expect(items.length).toBe(4);
  });

  it("should toggle collapsible on click", async function () {
    const trigger = await $("#all-panel .collapsible [data-trigger]");
    await trigger.click();
    const expanded = await trigger.getAttribute("aria-expanded");
    expect(expanded).toBe("true");
  });

  it("should render badges", async function () {
    const badges = await $$("span.badge");
    expect(badges.length).toBeGreaterThan(0);
  });
});
