import { describe, expect, it } from "vitest";
import { applyTool, insertLink, toggleLines, toggleWrap } from "./format.js";

const sel = (text: string, a: number, b: number) => (e: { text: string; start: number; end: number }) => ({ t: e.text, s: text.slice(e.start, e.end) });

describe("toggleWrap", () => {
    it("wraps the selection and keeps it selected", () => {
        const e = toggleWrap("say hello now", 4, 9, "**");
        expect(e.text).toBe("say **hello** now");
        expect(e.text.slice(e.start, e.end)).toBe("hello");
    });
    it("puts the caret between the markers when nothing is selected", () => {
        const e = toggleWrap("ab", 1, 1, "**");
        expect(e).toEqual({ text: "a****b", start: 3, end: 3 });
    });
    it("unwraps when the markers sit just outside the selection", () => {
        const e = toggleWrap("say **hello** now", 6, 11, "**");
        expect(e.text).toBe("say hello now");
        expect(e.text.slice(e.start, e.end)).toBe("hello");
    });
    it("unwraps when the markers are inside the selection", () => {
        const e = toggleWrap("say **hello** now", 4, 13, "**");
        expect(e.text).toBe("say hello now");
        expect(e.text.slice(e.start, e.end)).toBe("hello");
    });
    it("applying twice is the identity", () => {
        const once = toggleWrap("hello", 0, 5, "~~");
        const twice = toggleWrap(once.text, once.start, once.end, "~~");
        expect(twice.text).toBe("hello");
    });
    it("italic inside bold adds a marker rather than removing one", () => {
        const e = toggleWrap("**hello**", 2, 7, "*");
        expect(e.text).toBe("***hello***");
    });
    it("italic is removed from bold-italic, leaving bold", () => {
        const e = toggleWrap("***hello***", 3, 8, "*");
        expect(e.text).toBe("**hello**");
    });
    it("bold is removed from bold-italic, leaving italic", () => {
        const e = toggleWrap("***hello***", 3, 8, "**");
        expect(e.text).toBe("*hello*");
    });
    it("bold is not mistaken for present around plain italic", () => {
        expect(toggleWrap("*hello*", 1, 6, "**").text).toBe("***hello***");
    });
    it("code uses a backtick", () => {
        expect(toggleWrap("x = 1", 0, 5, "`").text).toBe("`x = 1`");
    });
});

describe("insertLink", () => {
    it("wraps the selection and selects the address", () => {
        const e = insertLink("see docs here", 4, 8);
        expect(e.text).toBe("see [docs](https://) here");
        expect(e.text.slice(e.start, e.end)).toBe("https://");
    });
    it("with no selection puts the caret in the empty brackets", () => {
        const e = insertLink("ab", 1, 1);
        expect(e.text).toBe("a[](https://)b");
        expect(e.start).toBe(2);
        expect(e.end).toBe(2);
    });
});

describe("toggleLines", () => {
    it("prefixes the line the caret is on", () => {
        expect(toggleLines("one\ntwo\nthree", 5, 5, "bulletList").text).toBe("one\n- two\nthree");
    });
    it("prefixes every selected line", () => {
        expect(toggleLines("one\ntwo\nthree", 0, 7, "bulletList").text).toBe("- one\n- two\nthree");
    });
    it("takes the prefix off when every line has it", () => {
        expect(toggleLines("- one\n- two", 0, 11, "bulletList").text).toBe("one\ntwo");
    });
    it("numbers from 1 and skips blank lines without consuming a number", () => {
        expect(toggleLines("a\n\nb", 0, 4, "numberedList").text).toBe("1. a\n\n2. b");
    });
    it("replaces a different list prefix rather than stacking", () => {
        expect(toggleLines("- one", 0, 5, "numberedList").text).toBe("1. one");
    });
    it("heading uses the given level, and toggles off", () => {
        const on = toggleLines("Title", 0, 5, "heading", 3);
        expect(on.text).toBe("### Title");
        expect(toggleLines(on.text, 0, on.text.length, "heading", 3).text).toBe("Title");
    });
    it("a quote is not doubled", () => {
        expect(toggleLines("> a", 0, 3, "quote").text).toBe("a");
    });
    it("a selection ending at the start of the next line leaves that line alone", () => {
        expect(toggleLines("one\ntwo", 0, 4, "quote").text).toBe("> one\ntwo");
    });
    it("keeps the selection on the same text", () => {
        const e = toggleLines("one two", 4, 7, "bulletList");
        expect(e.text).toBe("- one two");
        expect(e.text.slice(e.start, e.end)).toBe("two");
    });
});

describe("applyTool", () => {
    it("dispatches wrap, link and line tools", () => {
        expect(applyTool("bold", "a", 0, 1).text).toBe("**a**");
        expect(applyTool("link", "a", 0, 1).text).toBe("[a](https://)");
        expect(applyTool("quote", "a", 0, 1).text).toBe("> a");
    });
    it("passes the heading level through", () => {
        expect(applyTool("heading", "a", 0, 1, { headingLevel: 1 }).text).toBe("# a");
    });
});
