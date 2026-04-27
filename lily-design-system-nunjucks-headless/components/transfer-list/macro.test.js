import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("transfer-list", () => {
  const baseParams = {
    label: "Members",
    sourceLabel: "Available",
    targetLabel: "Selected",
    sourceHtml: "<ul class='src'></ul>",
    targetHtml: "<ul class='tgt'></ul>",
  };

  it("renders a <div> with the base class and role='group'", () => {
    const { document } = render("transfer-list", baseParams);
    const el = document.querySelector("div.transfer-list");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("group");
  });

  it("renders aria-label on the group", () => {
    const { document } = render("transfer-list", baseParams);
    expect(document.querySelector("div.transfer-list").getAttribute("aria-label"))
      .toBe("Members");
  });

  it("renders source <section> with aria-label", () => {
    const { document } = render("transfer-list", baseParams);
    const src = document.querySelector("section.transfer-list-source");
    expect(src).toBeTruthy();
    expect(src.getAttribute("aria-label")).toBe("Available");
    expect(src.querySelector("ul.src")).toBeTruthy();
  });

  it("renders target <section> with aria-label", () => {
    const { document } = render("transfer-list", baseParams);
    const tgt = document.querySelector("section.transfer-list-target");
    expect(tgt).toBeTruthy();
    expect(tgt.getAttribute("aria-label")).toBe("Selected");
    expect(tgt.querySelector("ul.tgt")).toBeTruthy();
  });

  it("renders actions between the two lists when actionsHtml is provided", () => {
    const { document } = render("transfer-list", {
      ...baseParams,
      actionsHtml: "<button class='right'>→</button><button class='left'>←</button>",
    });
    const actions = document.querySelector("div.transfer-list-actions");
    expect(actions).toBeTruthy();
    expect(actions.querySelector("button.right")).toBeTruthy();
    expect(actions.querySelector("button.left")).toBeTruthy();
  });

  it("omits actions when actionsHtml is not provided", () => {
    const { document } = render("transfer-list", baseParams);
    expect(document.querySelector("div.transfer-list-actions")).toBeNull();
  });

  it("renders the source/target/actions in document order", () => {
    const { document } = render("transfer-list", {
      ...baseParams,
      actionsHtml: "<button class='mid'></button>",
    });
    const root = document.querySelector("div.transfer-list");
    const children = Array.from(root.children);
    expect(children[0].classList.contains("transfer-list-source")).toBe(true);
    expect(children[1].classList.contains("transfer-list-actions")).toBe(true);
    expect(children[2].classList.contains("transfer-list-target")).toBe(true);
  });

  it("renders sourceText and targetText as plain text when html omitted", () => {
    const { document } = render("transfer-list", {
      label: "M",
      sourceLabel: "A",
      targetLabel: "S",
      sourceText: "available",
      targetText: "selected",
    });
    expect(document.querySelector("section.transfer-list-source").textContent
      .trim()).toBe("available");
    expect(document.querySelector("section.transfer-list-target").textContent
      .trim()).toBe("selected");
  });

  it("appends params.classes", () => {
    const { document } = render("transfer-list", {
      ...baseParams,
      classes: "extra",
    });
    expect(document.querySelector("div.transfer-list.extra")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("transfer-list", {
      ...baseParams,
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("div.transfer-list").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("transfer-list", baseParams);
    expect(html).not.toContain("<style");
  });
});
