// Behaviour tests for the small element modules: TagInput.razor.js, HorizontalScroller.razor.js and Details.razor.js
// (mirrors the key cases in the Svelte tests).
// Run: JSDOM_PATH=/path/to/jsdom node --test tests/js/element-modules.test.mjs
// Needs the `jsdom` package (resolved normally, or via the JSDOM_PATH env var).
import { test } from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import path from "node:path";

const { JSDOM } = process.env.JSDOM_PATH
    ? await import(pathToFileURL(path.join(process.env.JSDOM_PATH, "lib/api.js")).href).then(
          (m) => m.default ?? m,
      )
    : await import("jsdom");

const dom = new JSDOM("<!doctype html><body></body>", { pretendToBeVisual: true });
const { document, KeyboardEvent, Event } = dom.window;
const modules = "../../src/LilyBlazorHeadless/Components/";
const tagInput = await import(`${modules}TagInput.razor.js`);
const scroller = await import(`${modules}HorizontalScroller.razor.js`);
const details = await import(`${modules}Details.razor.js`);

const recorder = () => {
    const calls = [];
    return { calls, invokeMethodAsync: (...args) => calls.push(args) };
};
const press = (node, key, init = {}) => {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
    node.dispatchEvent(event);
    return event;
};
const field = (value) => {
    const input = document.createElement("input");
    input.value = value;
    return input;
};

test("TagInput: Enter with text adds the trimmed text, clears the field and stays out of the form", () => {
    const input = field("  one  ");
    const dotnet = recorder();
    tagInput.attach(input, dotnet);
    assert.equal(press(input, "Enter").defaultPrevented, true);
    assert.deepEqual(dotnet.calls, [["OnTagAdd", "one"]]);
    assert.equal(input.value, "");
});

test("TagInput: Enter with no text is a normal Enter, so a form can submit", () => {
    const input = field("   ");
    const dotnet = recorder();
    tagInput.attach(input, dotnet);
    assert.equal(press(input, "Enter").defaultPrevented, false);
    assert.deepEqual(dotnet.calls, []);
});

test("TagInput: Enter that confirms an IME composition adds nothing", () => {
    const input = field("にほん");
    const dotnet = recorder();
    tagInput.attach(input, dotnet);
    assert.equal(press(input, "Enter", { isComposing: true }).defaultPrevented, false);
    assert.deepEqual(dotnet.calls, []);
});

test("TagInput: other keys are left alone, and dispose detaches", () => {
    const input = field("one");
    const dotnet = recorder();
    const handle = tagInput.attach(input, dotnet);
    assert.equal(press(input, "a").defaultPrevented, false);
    handle.dispose();
    press(input, "Enter");
    assert.deepEqual(dotnet.calls, []);
});

const region = () => {
    const node = document.createElement("div");
    node.dataset.step = "40";
    node.scrolls = [];
    node.scrollBy = (o) => node.scrolls.push(["by", o.left]);
    node.scrollTo = (o) => node.scrolls.push(["to", o.left]);
    Object.defineProperty(node, "scrollWidth", { value: 900 });
    return node;
};

test("HorizontalScroller: arrows move by the step, Home and End go to the ends", () => {
    const node = region();
    scroller.attach(node);
    for (const key of ["ArrowRight", "ArrowLeft", "Home", "End"]) {
        assert.equal(press(node, key).defaultPrevented, true, key);
    }
    assert.deepEqual(node.scrolls, [
        ["by", 40],
        ["by", -40],
        ["to", 0],
        ["to", 900],
    ]);
});

test("HorizontalScroller: reads a new step, and leaves other keys alone", () => {
    const node = region();
    const handle = scroller.attach(node);
    node.dataset.step = "10";
    press(node, "ArrowRight");
    assert.equal(press(node, "ArrowDown").defaultPrevented, false);
    handle.dispose();
    press(node, "ArrowRight");
    assert.deepEqual(node.scrolls, [["by", 10]]);
});

test("Details: the toggle event reports the element's state, whichever way it went", () => {
    const node = document.createElement("details");
    const dotnet = recorder();
    details.attach(node, dotnet, false);
    assert.deepEqual(dotnet.calls, []);
    node.open = true;
    node.dispatchEvent(new Event("toggle"));
    node.open = false;
    node.dispatchEvent(new Event("toggle"));
    assert.deepEqual(dotnet.calls, [
        ["OnDetailsToggle", true],
        ["OnDetailsToggle", false],
    ]);
});

test("Details: a reader who opened it before the module loaded is reported", () => {
    const node = document.createElement("details");
    node.open = true;
    const dotnet = recorder();
    details.attach(node, dotnet, false);
    assert.deepEqual(dotnet.calls, [["OnDetailsToggle", true]]);
});

const search = await import(`${modules}TextInputWithSearch.razor.js`);
const upload = await import(`${modules}FileUpload.razor.js`);

test("TextInputWithSearch: Enter searches with the field's text and never submits", () => {
    const input = field("lily");
    const dotnet = recorder();
    search.attach(input, dotnet);
    assert.equal(press(input, "Enter").defaultPrevented, true);
    input.value = "";
    assert.equal(press(input, "Enter").defaultPrevented, true);
    assert.deepEqual(dotnet.calls, [
        ["OnEnter", "lily"],
        ["OnEnter", ""],
    ]);
});

test("TextInputWithSearch: Enter that confirms an IME composition does nothing", () => {
    const input = field("にほん");
    const dotnet = recorder();
    search.attach(input, dotnet);
    assert.equal(press(input, "Enter", { isComposing: true }).defaultPrevented, false);
    assert.deepEqual(dotnet.calls, []);
});

test("FileUpload: the button clicks the input until disposed", () => {
    const button = document.createElement("button");
    let clicks = 0;
    const handle = upload.attach(button, { click: () => clicks++ });
    button.click();
    handle.dispose();
    button.click();
    assert.equal(clicks, 1);
});

const video = await import(`${modules}VideoPlayer.razor.js`);
const scrollerBase = await import(`${modules}ScrollerBase.razor.js`);
const visible = await import(`${modules}Visible.razor.js`);

// jsdom has no IntersectionObserver or layout; these report when told to.
const observers = [];
globalThis.IntersectionObserver = class {
    constructor(callback, options) {
        Object.assign(this, { callback, options, targets: [], disconnected: false });
        observers.push(this);
    }
    observe(target) {
        this.targets.push(target);
    }
    disconnect() {
        this.disconnected = true;
    }
};
globalThis.window = dom.window;
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = clearTimeout;
const frame = () => new Promise((resolve) => setTimeout(resolve, 5));
const say = (observer, target, isIntersecting) => observer.callback([{ target, isIntersecting }]);

test("VideoPlayer: sets muted, and plays only while in view", async () => {
    const calls = [];
    const node = {
        muted: false,
        play: () => (calls.push("play"), Promise.resolve()),
        pause: () => calls.push("pause"),
    };
    const handle = video.attach(node, true, true);
    assert.equal(node.muted, true);
    const observer = observers.at(-1);
    assert.equal(observer.options.threshold, 0.5);
    say(observer, node, true);
    say(observer, node, false);
    assert.deepEqual(calls, ["play", "pause"]);
    handle.dispose();
    assert.equal(observer.disconnected, true);
});

test("VideoPlayer: without autoplay nothing watches it", () => {
    const before = observers.length;
    video.attach({ muted: false }, false, false);
    assert.equal(observers.length, before);
});

const steps = (top, height = 100) => {
    const root = document.createElement("div");
    root.append(document.createElement("section"), document.createElement("section"));
    root.getBoundingClientRect = () => ({ top, height });
    return root;
};

test("ScrollerBase: reports the step at the offset line, not one that leaves", () => {
    const root = steps(0);
    const dotnet = recorder();
    const handle = scrollerBase.attach(root, dotnet, 0.25, true, false);
    const observer = observers.at(-1);
    assert.equal(observer.options.rootMargin, "-25.00% 0px -75.00% 0px");
    say(observer, root.children[1], true);
    say(observer, root.children[1], false);
    assert.deepEqual(dotnet.calls, [["OnScrollerIndex", 1]]);
    handle.dispose();
});

test("ScrollerBase: progress is kept to 0 to 1, sent once a frame, and only when wanted", async () => {
    const root = steps(-10000000);
    const dotnet = recorder();
    const handle = scrollerBase.attach(root, dotnet, 0.5, false, true);
    assert.deepEqual(dotnet.calls, [["OnScrollerProgress", 1]]);
    root.getBoundingClientRect = () => ({ top: 10000000, height: 100 });
    for (let i = 0; i < 5; i++) dom.window.dispatchEvent(new Event("scroll"));
    await frame();
    assert.deepEqual(dotnet.calls, [
        ["OnScrollerProgress", 1],
        ["OnScrollerProgress", 0],
    ]);
    handle.dispose();
    dotnet.calls.length = 0;
    root.getBoundingClientRect = () => ({ top: -10000000, height: 100 });
    dom.window.dispatchEvent(new Event("scroll"));
    await frame();
    assert.deepEqual(dotnet.calls, []);
    const quiet = recorder();
    scrollerBase.attach(steps(0), quiet, 0.5, false, false).dispose();
    assert.deepEqual(quiet.calls, []);
});

test("ScrollerBase: inside a ScrollerVideo the video follows, with no round trip", () => {
    const wrapper = document.createElement("div");
    wrapper.className = "scroller-video";
    const media = document.createElement("video");
    Object.defineProperty(media, "duration", { value: 100 });
    const root = steps(-10000000);
    wrapper.append(media, root);
    const dotnet = recorder();
    const handle = scrollerBase.attach(root, dotnet, 0.5, false, false);
    assert.equal(media.muted, true);
    assert.equal(media.currentTime, 100);
    assert.deepEqual(dotnet.calls, []);
    handle.dispose();
});

test("Visible: reports on and off, and Once stops at the first sighting", () => {
    const node = document.createElement("div");
    const dotnet = recorder();
    visible.attach(node, dotnet, false, 0.5, "10px");
    const observer = observers.at(-1);
    assert.deepEqual(observer.options, { threshold: 0.5, rootMargin: "10px" });
    say(observer, node, true);
    say(observer, node, false);
    assert.deepEqual(dotnet.calls, [
        ["OnVisibleChange", true],
        ["OnVisibleChange", false],
    ]);
    visible.attach(node, recorder(), true, 0, "0px");
    say(observers.at(-1), node, true);
    assert.equal(observers.at(-1).disconnected, true);
});
