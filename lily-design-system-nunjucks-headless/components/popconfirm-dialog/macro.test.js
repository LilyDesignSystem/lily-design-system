import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("popconfirm-dialog", () => {
  it("renders a <div> with the base class and role='alertdialog'", () => {
    const { document } = render("popconfirm-dialog", {
      open: true,
      title: "Delete?",
      confirmLabel: "Yes",
      cancelLabel: "No",
    });
    const el = document.querySelector("div.popconfirm-dialog");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("alertdialog");
    expect(el.getAttribute("aria-modal")).toBe("false");
  });

  it("renders the title with id linked via aria-labelledby", () => {
    const { document } = render("popconfirm-dialog", {
      open: true,
      title: "Delete?",
      confirmLabel: "Yes",
      cancelLabel: "No",
    });
    const root = document.querySelector("div.popconfirm-dialog");
    const labelledby = root.getAttribute("aria-labelledby");
    expect(labelledby).toBeTruthy();
    const title = document.getElementById(labelledby);
    expect(title).toBeTruthy();
    expect(title.tagName).toBe("H2");
    expect(title.classList.contains("popconfirm-dialog-title")).toBe(true);
    expect(title.textContent).toBe("Delete?");
  });

  it("renders the description and links it via aria-describedby", () => {
    const { document } = render("popconfirm-dialog", {
      open: true,
      title: "Delete?",
      description: "Cannot be undone.",
      confirmLabel: "Yes",
      cancelLabel: "No",
    });
    const root = document.querySelector("div.popconfirm-dialog");
    const describedby = root.getAttribute("aria-describedby");
    expect(describedby).toBeTruthy();
    const desc = document.getElementById(describedby);
    expect(desc).toBeTruthy();
    expect(desc.tagName).toBe("P");
    expect(desc.classList.contains("popconfirm-dialog-description")).toBe(true);
    expect(desc.textContent).toBe("Cannot be undone.");
  });

  it("omits aria-describedby when no description", () => {
    const { document } = render("popconfirm-dialog", {
      open: true,
      title: "Delete?",
      confirmLabel: "Yes",
      cancelLabel: "No",
    });
    const root = document.querySelector("div.popconfirm-dialog");
    expect(root.hasAttribute("aria-describedby")).toBe(false);
    expect(document.querySelector("p.popconfirm-dialog-description"))
      .toBeNull();
  });

  it("renders confirm and cancel buttons with correct labels and order", () => {
    const { document } = render("popconfirm-dialog", {
      open: true,
      title: "Delete?",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    const cancel = document.querySelector("button.popconfirm-dialog-cancel");
    const confirm = document.querySelector("button.popconfirm-dialog-confirm");
    expect(cancel).toBeTruthy();
    expect(confirm).toBeTruthy();
    expect(cancel.getAttribute("type")).toBe("button");
    expect(confirm.getAttribute("type")).toBe("button");
    expect(cancel.textContent).toBe("Cancel");
    expect(confirm.textContent).toBe("Delete");
    // cancel appears before confirm
    expect(
      cancel.compareDocumentPosition(confirm)
        & cancel.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("hides when open is false (default)", () => {
    const { document } = render("popconfirm-dialog", {
      title: "Delete?",
      confirmLabel: "Yes",
      cancelLabel: "No",
    });
    expect(
      document.querySelector("div.popconfirm-dialog").hasAttribute("hidden"),
    ).toBe(true);
  });

  it("is visible when open is true", () => {
    const { document } = render("popconfirm-dialog", {
      open: true,
      title: "Delete?",
      confirmLabel: "Yes",
      cancelLabel: "No",
    });
    expect(
      document.querySelector("div.popconfirm-dialog").hasAttribute("hidden"),
    ).toBe(false);
  });

  it("uses params.id as the id stem when provided", () => {
    const { document } = render("popconfirm-dialog", {
      open: true,
      id: "my-popconfirm",
      title: "Delete?",
      description: "Cannot be undone.",
      confirmLabel: "Yes",
      cancelLabel: "No",
    });
    const root = document.querySelector("div.popconfirm-dialog");
    expect(root.id).toBe("my-popconfirm");
    expect(root.getAttribute("aria-labelledby")).toBe("my-popconfirm-title");
    expect(root.getAttribute("aria-describedby")).toBe("my-popconfirm-description");
  });

  it("appends params.classes", () => {
    const { document } = render("popconfirm-dialog", {
      open: true,
      title: "Delete?",
      confirmLabel: "Yes",
      cancelLabel: "No",
      classes: "extra",
    });
    expect(document.querySelector("div.popconfirm-dialog.extra")).toBeTruthy();
  });

  it("renders params.attributes on the root", () => {
    const { document } = render("popconfirm-dialog", {
      open: true,
      title: "Delete?",
      confirmLabel: "Yes",
      cancelLabel: "No",
      attributes: { "data-test": "x" },
    });
    expect(
      document.querySelector("div.popconfirm-dialog").getAttribute("data-test"),
    ).toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("popconfirm-dialog", {
      open: true,
      title: "Delete?",
      confirmLabel: "Yes",
      cancelLabel: "No",
    });
    expect(html).not.toContain("<style");
  });
});
