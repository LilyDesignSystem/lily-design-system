// Family: guided and composite widgets. carousel, tour, coachmark, file-upload,
// and four containers whose contract is a role plus a name and nothing more
// (calendar-range-picker, emoji-character-picker, image-cropper, signature-pad).

const press = `const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};`;

const passive = (slug, tag, role, what, markupHint) => ({
  tag, keyboard: "None (passive element)",
  aria: `role="${role}" with aria-label naming ${what}`,
  markup: `<div class="${slug}" role="${role}" aria-label="">
  <!-- ${markupHint} -->
</div>`,
  sel: `div.${slug}`,
  test: `
  it('is role="${role}" with an accessible name', async () => {
    await mount("${slug}");
    expect(el().getAttribute("role")).toBe("${role}");
    expect(el().hasAttribute("aria-label")).toBe(true);
  });`,
});

const slides = (n, cls, bind) =>
  Array.from({ length: n }, (_, i) => `    <div class="${cls}" x-bind="${bind}(${i})"><!-- Consumer provides slide content --></div>`).join("\n");

export default {
  carousel: {
    tag: "div", keyboard: "Tab to the previous and next buttons; Enter or Space moves, wrapping at the ends",
    aria: 'role="region" with aria-roledescription="carousel" and aria-label; slides are role="group" with aria-roledescription="slide" and a numeric "n / m" label; inactive slides are hidden',
    markup: `<div class="carousel" role="region" aria-roledescription="carousel" aria-label="" x-data="lilyCarousel(0)" x-bind="root">
  <button class="carousel-previous" aria-label="" x-bind="previous"><!-- Consumer provides icon --></button>
  <div class="carousel-slides">
${slides(3, "carousel-slide", "slide")}
  </div>
  <button class="carousel-next" aria-label="" x-bind="next"><!-- Consumer provides icon --></button>
</div>`,
    sel: "div.carousel",
    extra: `const slides = () => [...document.querySelectorAll(".carousel-slide")];
const previous = () => document.querySelector(".carousel-previous");
const next = () => document.querySelector(".carousel-next");`,
    test: `
  it("is a carousel region showing only the first slide", async () => {
    await mount("carousel");
    expect(el().getAttribute("role")).toBe("region");
    expect(el().getAttribute("aria-roledescription")).toBe("carousel");
    expect(slides().map((s) => s.hidden)).toEqual([false, true, true]);
    expect(slides().map((s) => s.getAttribute("role"))).toEqual(["group", "group", "group"]);
    expect(slides().map((s) => s.getAttribute("aria-label"))).toEqual(["1 / 3", "2 / 3", "3 / 3"]);
    expect(el().getAttribute("data-index")).toBe("0");
  });
  it("next and previous move one slide and wrap", async () => {
    await mount("carousel");
    next().click(); await tick();
    expect(slides().map((s) => s.hidden)).toEqual([true, false, true]);
    previous().click(); await tick();
    previous().click(); await tick();
    expect(slides().map((s) => s.hidden)).toEqual([true, true, false]);
    next().click(); await tick();
    expect(slides()[0].hidden).toBe(false);
    expect(el().getAttribute("data-index")).toBe("0");
  });
  it("announces the slide it lands on", async () => {
    await mount("carousel");
    const seen = vi.fn();
    el().addEventListener("lily:change", (e) => seen(e.detail));
    next().click(); await tick();
    expect(seen).toHaveBeenCalledWith({ index: 1 });
  });`,
  },

  tour: {
    tag: "div", keyboard: "Tab to previous, next and close; Escape ends the tour",
    aria: 'aria-label names the tour; each step is a list item with aria-roledescription="step" (no role="group": axe rejects it inside an ol); the current step has aria-current="step", the others are hidden and aria-hidden',
    markup: `<div class="tour" aria-label="" x-data="lilyTour(0)" x-bind="root">
  <ol class="tour-list">
${Array.from({ length: 3 }, (_, i) => `    <li class="tour-list-item" x-bind="item(${i})"><!-- Consumer provides step content --></li>`).join("\n")}
  </ol>
  <button class="tour-previous" aria-label="" x-bind="previous"><!-- Consumer provides label --></button>
  <button class="tour-next" aria-label="" x-bind="next"><!-- Consumer provides label --></button>
  <button class="tour-close" aria-label="" x-bind="close"><!-- Consumer provides label --></button>
</div>`,
    sel: "div.tour",
    extra: `${press}\nconst steps = () => [...document.querySelectorAll(".tour-list-item")];
const button = (name) => document.querySelector(".tour-" + name);`,
    test: `
  it("shows the first step as current and hides the rest from everyone", async () => {
    await mount("tour");
    expect(steps().map((s) => s.getAttribute("aria-roledescription"))).toEqual(["step", "step", "step"]);
    // A list item must stay a list item inside the ol (axe: list), so no role="group" here.
    expect(steps().some((s) => s.hasAttribute("role"))).toBe(false);
    expect(steps().map((s) => s.getAttribute("aria-current"))).toEqual(["step", null, null]);
    expect(steps().map((s) => s.hidden)).toEqual([false, true, true]);
    expect(steps().map((s) => s.getAttribute("aria-hidden"))).toEqual([null, "true", "true"]);
    expect(steps().map((s) => s.getAttribute("aria-label"))).toEqual(["1 / 3", "2 / 3", "3 / 3"]);
  });
  it("next and previous move the current step, and previous stops at the first", async () => {
    await mount("tour");
    button("next").click(); await tick();
    expect(steps().map((s) => s.getAttribute("aria-current"))).toEqual([null, "step", null]);
    button("previous").click(); await tick();
    button("previous").click(); await tick();
    expect(steps()[0].getAttribute("aria-current")).toBe("step");
  });
  it("next on the last step finishes the tour", async () => {
    await mount("tour");
    const finished = vi.fn();
    el().addEventListener("lily:finish", finished);
    button("next").click(); await tick();
    button("next").click(); await tick();
    expect(el().hidden).toBe(false);
    button("next").click(); await tick();
    expect(el().hidden).toBe(true);
    expect(finished).toHaveBeenCalledTimes(1);
  });
  it("the close button and Escape end it", async () => {
    await mount("tour");
    const closed = vi.fn();
    el().addEventListener("lily:close", closed);
    button("close").click(); await tick();
    expect(el().hidden).toBe(true);
    await mount("tour");
    el().addEventListener("lily:close", closed);
    await press(button("next"), "Escape");
    expect(el().hidden).toBe(true);
    expect(closed).toHaveBeenCalledTimes(2);
  });`,
  },

  coachmark: {
    tag: "div", keyboard: "Tab moves in and out; Enter or Space on the dismiss button; Escape dismisses",
    aria: 'role="dialog" with aria-modal="false", aria-labelledby the title and aria-describedby the description; the dismiss button has an aria-label; hidden once dismissed',
    markup: `<div class="coachmark" role="dialog" aria-modal="false" aria-labelledby="coachmark-title-1" aria-describedby="coachmark-desc-1" x-data="lilyCoachmark(true)" x-bind="root">
  <h2 class="coachmark-title" id="coachmark-title-1"><!-- Consumer provides title --></h2>
  <p class="coachmark-description" id="coachmark-desc-1"><!-- Consumer provides description --></p>
  <button class="coachmark-dismiss" aria-label="" x-bind="dismissButton">×</button>
</div>`,
    sel: "div.coachmark",
    extra: `${press}\nconst dismiss = () => el().querySelector(".coachmark-dismiss");`,
    test: `
  it("is a non-modal dialog named and described by its own text", async () => {
    await mount("coachmark");
    expect(el().getAttribute("role")).toBe("dialog");
    expect(el().getAttribute("aria-modal")).toBe("false");
    expect(document.getElementById(el().getAttribute("aria-labelledby")).className).toBe("coachmark-title");
    expect(document.getElementById(el().getAttribute("aria-describedby")).className).toBe("coachmark-description");
    expect(el().hidden).toBe(false);
  });
  it("the dismiss button hides it and announces lily:dismiss", async () => {
    await mount("coachmark");
    const seen = vi.fn();
    el().addEventListener("lily:dismiss", seen);
    dismiss().click(); await tick();
    expect(el().hidden).toBe(true);
    expect(seen).toHaveBeenCalledTimes(1);
  });
  it("Escape dismisses it", async () => {
    await mount("coachmark");
    await press(dismiss(), "Escape");
    expect(el().hidden).toBe(true);
  });`,
  },

  "file-upload": {
    tag: "div", keyboard: "Enter or Space on the button opens the file chooser",
    aria: 'aria-label on the button; the status is aria-live="polite" and carries data-file-count',
    markup: `<div class="file-upload" x-data="lilyFileUpload()">
  <button class="file-upload-button" aria-label="" x-bind="trigger"><!-- Consumer provides button text --></button>
  <input class="file-upload-input" hidden aria-hidden="true" tabindex="-1" x-bind="input">
  <span class="file-upload-status" data-file-count="0" x-bind="status"></span>
</div>`,
    sel: "div.file-upload",
    extra: `const button = () => el().querySelector("button");
const input = () => el().querySelector("input");
const status = () => el().querySelector(".file-upload-status");
const choose = async (files) => {
  Object.defineProperty(input(), "files", { value: files, configurable: true });
  input().dispatchEvent(new Event("change", { bubbles: true }));
  await tick();
};`,
    test: `
  it("is a button, a hidden file input and a polite status", async () => {
    await mount("file-upload");
    expect(button().type).toBe("button");
    expect(input().type).toBe("file");
    expect(input().hidden).toBe(true);
    expect(input().getAttribute("aria-hidden")).toBe("true");
    expect(input().getAttribute("tabindex")).toBe("-1");
    expect(status().getAttribute("aria-live")).toBe("polite");
    expect(status().getAttribute("data-file-count")).toBe("0");
  });
  it("the button opens the chooser by clicking the input, without submitting", async () => {
    await mount("file-upload");
    const clicked = vi.fn();
    input().addEventListener("click", clicked);
    button().click(); await tick();
    expect(clicked).toHaveBeenCalledTimes(1);
  });
  it("choosing files updates the count and announces them", async () => {
    await mount("file-upload");
    const seen = vi.fn();
    el().addEventListener("lily:change", (e) => seen(e.detail.files.length));
    await choose([new File(["a"], "a.txt"), new File(["b"], "b.txt")]);
    expect(status().getAttribute("data-file-count")).toBe("2");
    expect(status().textContent).toBe("2");
    expect(seen).toHaveBeenCalledWith(2);
    await choose([]);
    expect(status().getAttribute("data-file-count")).toBe("0");
    expect(status().textContent).toBe("");
  });`,
  },

  "calendar-range-picker": passive("calendar-range-picker", "div", "application", "the calendar range picker",
    "Consumer provides the calendar grid, date selection and range highlighting"),
  "emoji-character-picker": passive("emoji-character-picker", "div", "grid", "the emoji picker",
    "Consumer provides grid rows and cells holding the emoji, and any category filtering"),
  "image-cropper": passive("image-cropper", "div", "application", "the cropping purpose",
    "Consumer provides the image and the crop overlay (canvas, SVG handles or a cropping library)"),
  "signature-pad": passive("signature-pad", "div", "application", "the signing purpose",
    "Consumer provides the drawing surface (canvas, SVG, …)"),
};
