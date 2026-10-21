// Family: overlays. lilyOverlay (drawer, sheet, slide-out-drawer, popup,
// overlay-container), lilyDialog (alert-dialog, file-dialog), lilyConfirm
// (popconfirm-dialog); toast, sonner and timer are non-interactive live
// regions (Interactive: no in their AGENTS.md), so they carry no behaviour.

const surface = (slug, extra, modal, doc) => ({
  tag: "div", keyboard: "Escape closes and returns focus to the trigger; focus moves in on open",
  aria: `role="dialog" with aria-label${modal ? ', aria-modal="true"' : ""}; tabindex -1 so it can take focus; ${doc}`,
  markup: `<div x-data="lilyOverlay(false)">
  <button class="${slug}-trigger" x-bind="trigger" aria-controls="${slug}-1"><!-- Consumer provides trigger label --></button>
  <div class="${slug}" id="${slug}-1" role="dialog"${modal ? ' aria-modal="true"' : ""} aria-label="" tabindex="-1"${extra} x-bind="surface">
    <!-- Consumer provides content -->
    <button class="${slug}-close" x-bind="closer"><!-- Consumer provides close label --></button>
  </div>
</div>`,
  sel: `div.${slug}`,
  test: `
  const trigger = () => document.querySelector(".${slug}-trigger");
  it("is closed, with the dialog role${modal ? " and aria-modal" : ""}", async () => {
    await mount("${slug}");
    expect(el().hidden).toBe(true);
    expect(el().getAttribute("role")).toBe("dialog");${modal ? `
    expect(el().getAttribute("aria-modal")).toBe("true");` : `
    expect(el().hasAttribute("aria-modal")).toBe(false);`}
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });
  it("opens, moves focus in, and the close button returns focus to the trigger", async () => {
    await mount("${slug}");
    trigger().focus(); trigger().click(); await tick(); await tick();
    expect(el().hidden).toBe(false);
    expect(el().getAttribute("data-open")).toBe("true");
    expect(el().contains(document.activeElement)).toBe(true);
    document.querySelector(".${slug}-close").click(); await tick();
    expect(el().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });
  it("closes on Escape", async () => {
    await mount("${slug}");
    trigger().click(); await tick(); await tick();
    el().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await tick();
    expect(el().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });`,
});

const nativeDialog = (slug, role) => ({
  tag: "dialog", keyboard: "Tab cycles focus inside, Escape closes",
  aria: `native <dialog> opened with showModal()${role ? `; role="${role}"` : ""}; aria-label names it; aria-modal="true"`,
  markup: `<div x-data="lilyDialog(false)">
  <button class="${slug}-trigger" x-bind="trigger"><!-- Consumer provides trigger label --></button>
  <dialog class="${slug}"${role ? ` role="${role}"` : ""} aria-label="" x-bind="dialog">
    <!-- Consumer provides dialog content -->
    <button class="${slug}-close" x-bind="closer"><!-- Consumer provides label --></button>
  </dialog>
</div>`,
  sel: `dialog.${slug}`,
  test: `
  it("is closed, modal${role ? ", with its role" : ""}", async () => {
    await mount("${slug}");
    expect(el().open).toBe(false);
    expect(el().getAttribute("aria-modal")).toBe("true");${role ? `
    expect(el().getAttribute("role")).toBe("${role}");` : ""}
  });
  it("opens from the trigger and closes on Escape", async () => {
    await mount("${slug}");
    document.querySelector(".${slug}-trigger").click(); await tick();
    expect(el().open).toBe(true);
    el().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await tick();
    expect(el().open).toBe(false);
  });`,
});

export default {
  drawer: surface("drawer", ' data-side="right"', true, "data-side is for consumer CSS"),
  "slide-out-drawer": surface("slide-out-drawer", ' data-side="right"', true, "data-side is for consumer CSS"),
  sheet: surface("sheet", ' data-side="bottom"', true, "data-side is for consumer CSS"),
  popup: surface("popup", "", false, "non-modal"),
  "alert-dialog": nativeDialog("alert-dialog", "alertdialog"),
  "file-dialog": nativeDialog("file-dialog", ""),
  "overlay-container": {
    tag: "div", keyboard: "none: the backdrop is not focusable; the child dialog owns the keyboard",
    aria: 'role="presentation", aria-hidden follows open, hidden while closed; a backdrop click emits overlay-close',
    markup: `<div class="overlay-container" x-data="lilyOverlay(false)" x-bind="container">
  <!-- Consumer provides the overlay child (typically a dialog or sheet) -->
</div>`,
    test: `
  it("is a hidden presentation backdrop", async () => {
    await mount("overlay-container");
    expect(el().getAttribute("role")).toBe("presentation");
    expect(el().hidden).toBe(true);
    expect(el().getAttribute("aria-hidden")).toBe("true");
    expect(el().getAttribute("data-open")).toBe("false");
  });
  it("emits overlay-close for a backdrop click but not a child click", async () => {
    await mount("overlay-container", '<div class="overlay-container" x-data="lilyOverlay(true)" x-bind="container"><button id="inner">x</button></div>');
    const closed = vi.fn();
    el().addEventListener("overlay-close", closed);
    expect(el().hidden).toBe(false);
    document.getElementById("inner").click(); await tick();
    expect(closed).not.toHaveBeenCalled();
    el().click(); await tick();
    expect(closed).toHaveBeenCalledTimes(1);
  });`, sel: "div.overlay-container",
  },
  "popconfirm-dialog": {
    tag: "div", keyboard: "Tab between the buttons, Escape cancels",
    aria: 'role="alertdialog", aria-modal="false", labelled by its title and described by its description',
    markup: `<div x-data="lilyConfirm(false)">
  <button class="popconfirm-dialog-trigger" x-bind="trigger" aria-controls="popconfirm-dialog-1"><!-- Consumer provides trigger label --></button>
  <div class="popconfirm-dialog" id="popconfirm-dialog-1" role="alertdialog" aria-modal="false"
       aria-labelledby="popconfirm-dialog-title" aria-describedby="popconfirm-dialog-description" x-bind="root">
    <h2 class="popconfirm-dialog-title" id="popconfirm-dialog-title"><!-- Consumer provides the title --></h2>
    <p class="popconfirm-dialog-description" id="popconfirm-dialog-description"><!-- Consumer provides the description --></p>
    <button class="popconfirm-dialog-cancel" x-bind="cancelButton"><!-- Consumer provides the cancel label --></button>
    <button class="popconfirm-dialog-confirm" x-bind="confirmButton"><!-- Consumer provides the confirm label --></button>
  </div>
</div>`,
    test: `
  const trigger = () => document.querySelector(".popconfirm-dialog-trigger");
  it("is a hidden non-modal alertdialog", async () => {
    await mount("popconfirm-dialog");
    expect(el().getAttribute("role")).toBe("alertdialog");
    expect(el().getAttribute("aria-modal")).toBe("false");
    expect(el().hidden).toBe(true);
  });
  it("confirm emits lily:confirm and closes", async () => {
    await mount("popconfirm-dialog");
    const on = vi.fn(); document.addEventListener("lily:confirm", on);
    trigger().click(); await tick();
    expect(el().hidden).toBe(false);
    document.querySelector(".popconfirm-dialog-confirm").click(); await tick();
    expect(on).toHaveBeenCalledTimes(1);
    expect(el().hidden).toBe(true);
    document.removeEventListener("lily:confirm", on);
  });
  it("cancel and Escape emit lily:cancel and close", async () => {
    await mount("popconfirm-dialog");
    const on = vi.fn(); document.addEventListener("lily:cancel", on);
    trigger().click(); await tick();
    document.querySelector(".popconfirm-dialog-cancel").click(); await tick();
    expect(on).toHaveBeenCalledTimes(1);
    trigger().click(); await tick();
    el().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await tick();
    expect(on).toHaveBeenCalledTimes(2);
    expect(el().hidden).toBe(true);
    document.removeEventListener("lily:cancel", on);
  });`, sel: "div.popconfirm-dialog",
  },
  toast: {
    tag: "div", keyboard: "none: a live region",
    aria: 'role="status" with aria-live="polite"; use role="alert" with aria-live="assertive" for an urgent one. The consumer owns the lifecycle',
    markup: `<div class="toast" role="status" aria-live="polite" aria-label="">
  <!-- Consumer provides content -->
</div>`,
    test: `
  it('is a polite status live region', async () => {
    await mount("toast");
    expect(el().getAttribute("role")).toBe("status");
    expect(el().getAttribute("aria-live")).toBe("polite");
  });`, sel: "div.toast",
  },
  sonner: {
    tag: "div", keyboard: "none: a live region",
    aria: 'role="region" with aria-label and aria-live="polite"; the consumer provides the toasts and owns their lifecycle',
    markup: `<div class="sonner" role="region" aria-live="polite" aria-label="">
  <!-- Consumer provides the toast elements -->
</div>`,
    test: `
  it('is a labelled polite region', async () => {
    await mount("sonner");
    expect(el().getAttribute("role")).toBe("region");
    expect(el().getAttribute("aria-live")).toBe("polite");
    expect(el().hasAttribute("aria-label")).toBe(true);
  });`, sel: "div.sonner",
  },
  timer: {
    tag: "time", keyboard: "none",
    aria: 'role="timer" (implicitly aria-live="off": a ticking clock must not chatter); datetime is machine-readable; the consumer owns the countdown',
    markup: `<time class="timer" role="timer" aria-label="" datetime="">
  <!-- Consumer provides the formatted time -->
</time>`,
    test: `
  it("is a <time> with role=timer", async () => {
    await mount("timer");
    expect(el().tagName).toBe("TIME");
    expect(el().getAttribute("role")).toBe("timer");
  });`, sel: "time.timer",
  },
};
