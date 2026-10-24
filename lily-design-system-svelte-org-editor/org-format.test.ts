import { describe, expect, it } from "vitest";
import {
    addProperty,
    applyTool,
    cycleCheckbox,
    cyclePriority,
    cycleTodo,
    dayStamp,
    insertContact,
    insertLink,
    insertTimestamp,
    localToday,
    shiftHeadings,
    toggleBlock,
    toggleHeading,
    toggleList,
    togglePlanning,
    toggleWrap,
    TOOL_GROUPS,
    TOOL_IDS,
} from "./org-format.js";

const sel = (e: { text: string; start: number; end: number }) => e.text.slice(e.start, e.end);

describe("dates", () => {
    it("names the weekday by UTC date maths", () => {
        expect(dayStamp("2026-10-24")).toBe("2026-10-24 Sat");
        expect(dayStamp("2026-10-25")).toBe("2026-10-25 Sun");
        expect(dayStamp("2024-02-29")).toBe("2024-02-29 Thu");
        expect(dayStamp("2000-01-01")).toBe("2000-01-01 Sat");
    });
    it("localToday is the local calendar date", () => {
        expect(localToday(new Date(2026, 9, 24, 23, 59))).toBe("2026-10-24");
        expect(localToday(new Date(2026, 0, 5))).toBe("2026-01-05");
    });
    it("a timestamp replaces the selection and selects the date", () => {
        const e = insertTimestamp("due: soon", 5, 9, "2026-10-24");
        expect(e.text).toBe("due: <2026-10-24 Sat>");
        expect(sel(e)).toBe("2026-10-24 Sat");
    });
});

describe("toggleWrap", () => {
    it("wraps with each org marker and selects the text", () => {
        for (const [m, out] of [["*", "say *hi* now"], ["/", "say /hi/ now"], ["_", "say _hi_ now"], ["+", "say +hi+ now"], ["~", "say ~hi~ now"], ["=", "say =hi= now"]]) {
            const e = toggleWrap("say hi now", 4, 6, m);
            expect(e.text).toBe(out);
            expect(sel(e)).toBe("hi");
        }
    });
    it("unwraps markers outside the selection or inside it", () => {
        expect(toggleWrap("say *hi* now", 5, 7, "*").text).toBe("say hi now");
        expect(toggleWrap("say *hi* now", 4, 8, "*").text).toBe("say hi now");
    });
    it("an empty selection inserts a pair with the caret between", () => {
        expect(toggleWrap("ab", 1, 1, "=")).toEqual({ text: "a==b", start: 2, end: 2 });
    });
    it("twice is the identity", () => {
        const once = toggleWrap("hi", 0, 2, "/");
        expect(toggleWrap(once.text, once.start, once.end, "/").text).toBe("hi");
    });
});

describe("insertLink", () => {
    it("with a selection: [[https://][text]], address selected", () => {
        const e = insertLink("see docs here", 4, 8);
        expect(e.text).toBe("see [[https://][docs]] here");
        expect(sel(e)).toBe("https://");
    });
    it("with none: [[https://]], address selected", () => {
        const e = insertLink("ab", 1, 1);
        expect(e.text).toBe("a[[https://]]b");
        expect(sel(e)).toBe("https://");
    });
});

describe("headings", () => {
    it("puts stars on every selected line and takes them off again", () => {
        const on = toggleHeading("one\ntwo", 0, 7);
        expect(on.text).toBe("* one\n* two");
        expect(toggleHeading(on.text, 0, on.text.length).text).toBe("one\ntwo");
    });
    it("uses the level given", () => {
        expect(toggleHeading("one", 0, 3, 3).text).toBe("*** one");
    });
    it("replaces a list prefix instead of stacking", () => {
        expect(toggleHeading("- one", 0, 5).text).toBe("* one");
    });
    it("promote and demote move headings and leave other lines", () => {
        expect(shiftHeadings("* a\n** b\nplain", 0, 14, 1).text).toBe("** a\n*** b\nplain");
        expect(shiftHeadings("** a\n*** b", 0, 10, -1).text).toBe("* a\n** b");
    });
    it("promote never goes below one star", () => {
        expect(shiftHeadings("* a", 0, 3, -1).text).toBe("* a");
    });
    it("shifting with no heading selected changes nothing", () => {
        expect(shiftHeadings("plain", 0, 5, 1)).toEqual({ text: "plain", start: 0, end: 5 });
    });
    it("a plain asterisk run without a space is not a heading", () => {
        expect(shiftHeadings("*bold* text", 0, 11, 1).text).toBe("*bold* text");
    });
});

describe("lists", () => {
    it("bullet and numbered prefix lines, number from 1, skip blank lines", () => {
        expect(toggleList("a\nb", 0, 3, "bulletList").text).toBe("- a\n- b");
        expect(toggleList("a\n\nb", 0, 4, "numberedList").text).toBe("1. a\n\n2. b");
    });
    it("toggle off when every non-empty line has it", () => {
        expect(toggleList("- a\n- b", 0, 7, "bulletList").text).toBe("a\nb");
    });
    it("replaces a heading or other list prefix", () => {
        expect(toggleList("* a", 0, 3, "numberedList").text).toBe("1. a");
        expect(toggleList("- a", 0, 3, "numberedList").text).toBe("1. a");
    });
    it("a checkbox bullet counts as a bullet", () => {
        expect(toggleList("- [ ] a", 0, 7, "bulletList").text).toBe("a");
    });
});

describe("checkbox", () => {
    it("cycles none → [ ] → [X] → none", () => {
        const one = cycleCheckbox("a", 0, 1);
        expect(one.text).toBe("- [ ] a");
        const two = cycleCheckbox(one.text, 0, one.text.length);
        expect(two.text).toBe("- [X] a");
        expect(cycleCheckbox(two.text, 0, two.text.length).text).toBe("a");
    });
    it("applies the same state to every selected line, by the first", () => {
        expect(cycleCheckbox("a\nb", 0, 3).text).toBe("- [ ] a\n- [ ] b");
        expect(cycleCheckbox("- [ ] a\nb", 0, 9).text).toBe("- [X] a\n- [X] b");
    });
    it("turns a plain bullet into a checkbox bullet", () => {
        expect(cycleCheckbox("- a", 0, 3).text).toBe("- [ ] a");
    });
    it("a selection of only blank lines changes nothing", () => {
        expect(cycleCheckbox("\n", 0, 0)).toEqual({ text: "\n", start: 0, end: 0 });
    });
});

describe("blocks", () => {
    const quote = (t: string, a: number, b: number) => applyTool("quote", t, a, b);
    it("wraps the selected lines and selects what is inside", () => {
        const e = quote("one\ntwo", 0, 7);
        expect(e.text).toBe("#+BEGIN_QUOTE\none\ntwo\n#+END_QUOTE");
        expect(sel(e)).toBe("one\ntwo");
    });
    it("wraps just the line the caret is on", () => {
        expect(quote("a\nb\nc", 2, 2).text).toBe("a\n#+BEGIN_QUOTE\nb\n#+END_QUOTE\nc");
    });
    it("unwraps when the selection holds the wrapper", () => {
        expect(quote("#+BEGIN_QUOTE\nx\n#+END_QUOTE", 0, 28).text).toBe("x");
    });
    it("unwraps when the wrapper is on the lines around the selection", () => {
        const t = "#+BEGIN_QUOTE\nx\n#+END_QUOTE";
        expect(quote(t, 14, 15).text).toBe("x");
    });
    it("wrapping twice is the identity", () => {
        const once = quote("hello", 0, 5);
        expect(quote(once.text, once.start, once.end).text).toBe("hello");
    });
    it("the begin and end lines are matched case-insensitively", () => {
        expect(quote("#+begin_quote\nx\n#+end_quote", 0, 28).text).toBe("x");
    });
    it("a source block", () => {
        expect(applyTool("sourceBlock", "x = 1", 0, 5).text).toBe("#+BEGIN_SRC\nx = 1\n#+END_SRC");
    });
    it("a quote is not unwrapped by a source block's end", () => {
        const t = "#+BEGIN_SRC\nx\n#+END_SRC";
        expect(quote(t, 12, 13).text).toBe("#+BEGIN_SRC\n#+BEGIN_QUOTE\nx\n#+END_QUOTE\n#+END_SRC");
    });
    it("a drawer uses the configured name and unwraps any drawer", () => {
        const on = applyTool("drawer", "note", 0, 4, { drawerName: "NOTES" });
        expect(on.text).toBe(":NOTES:\nnote\n:END:");
        expect(applyTool("drawer", on.text, 0, on.text.length).text).toBe("note");
        expect(applyTool("drawer", "x", 0, 1).text).toBe(":LOGBOOK:\nx\n:END:");
    });
    it("toggleBlock is usable directly", () => {
        const e = toggleBlock("a", 0, 1, "<", ">", (l) => l === "<", (l) => l === ">");
        expect(e.text).toBe("<\na\n>");
    });
});

describe("todo", () => {
    it("cycles none → TODO → DONE → none on a heading", () => {
        const a = cycleTodo("* Task", 0, 0);
        expect(a.text).toBe("* TODO Task");
        const b = cycleTodo(a.text, 0, 0);
        expect(b.text).toBe("* DONE Task");
        expect(cycleTodo(b.text, 0, 0).text).toBe("* Task");
    });
    it("turns a plain line into a TODO heading", () => {
        expect(cycleTodo("Buy milk", 3, 3).text).toBe("* TODO Buy milk");
    });
    it("turns a list item into a TODO heading rather than stacking", () => {
        expect(cycleTodo("- Buy milk", 0, 0).text).toBe("* TODO Buy milk");
    });
    it("keeps the level, the priority and the title", () => {
        expect(cycleTodo("*** [#A] Ship", 0, 0).text).toBe("*** TODO [#A] Ship");
    });
    it("acts on the line the caret is on only", () => {
        expect(cycleTodo("* a\n* b\n* c", 4, 4).text).toBe("* a\n* TODO b\n* c");
    });
    it("the keywords are an option", () => {
        const kw = ["NEXT", "WAIT", "DONE"];
        expect(cycleTodo("* t", 0, 0, kw).text).toBe("* NEXT t");
        expect(cycleTodo("* NEXT t", 0, 0, kw).text).toBe("* WAIT t");
        expect(cycleTodo("* DONE t", 0, 0, kw).text).toBe("* t");
    });
    it("a keyword that is only the start of a word is not a keyword", () => {
        expect(cycleTodo("* TODOS", 0, 0).text).toBe("* TODO TODOS");
    });
    it("keeps the caret on the same text", () => {
        const e = cycleTodo("* Task", 4, 4);
        expect(e.text.slice(e.start)).toBe("sk");
    });
    it("the heading level for a plain line is an option", () => {
        expect(cycleTodo("x", 0, 0, ["TODO"], 2).text).toBe("** TODO x");
    });
});

describe("priority", () => {
    it("cycles none → A → B → C → none", () => {
        const a = cyclePriority("* Task", 0, 0);
        expect(a.text).toBe("* [#A] Task");
        const b = cyclePriority(a.text, 0, 0);
        expect(b.text).toBe("* [#B] Task");
        const c = cyclePriority(b.text, 0, 0);
        expect(c.text).toBe("* [#C] Task");
        expect(cyclePriority(c.text, 0, 0).text).toBe("* Task");
    });
    it("goes after the keyword", () => {
        expect(cyclePriority("* TODO Task", 0, 0).text).toBe("* TODO [#A] Task");
    });
    it("turns a plain line into a heading", () => {
        expect(cyclePriority("Task", 0, 0).text).toBe("* [#A] Task");
    });
    it("priorities are an option", () => {
        expect(cyclePriority("* t", 0, 0, ["1", "2"]).text).toBe("* [#1] t");
    });
});

describe("planning", () => {
    const TODAY = "2026-10-24";
    it("adds a SCHEDULED line under the heading, with the date selected", () => {
        const e = togglePlanning("* Task\nbody", 0, 0, "SCHEDULED", TODAY);
        expect(e.text).toBe("* Task\nSCHEDULED: <2026-10-24 Sat>\nbody");
        expect(sel(e)).toBe("2026-10-24 Sat");
    });
    it("finds the heading above a body line", () => {
        const e = togglePlanning("* Task\nbody\nmore", 12, 12, "DEADLINE", TODAY);
        expect(e.text).toBe("* Task\nDEADLINE: <2026-10-24 Sat>\nbody\nmore");
    });
    it("puts the second keyword on the same planning line", () => {
        const one = togglePlanning("* Task", 0, 0, "DEADLINE", TODAY);
        const two = togglePlanning(one.text, 0, 0, "SCHEDULED", "2026-10-25");
        expect(two.text).toBe("* Task\nDEADLINE: <2026-10-24 Sat> SCHEDULED: <2026-10-25 Sun>");
        expect(sel(two)).toBe("2026-10-25 Sun");
    });
    it("takes a keyword off again, and the line when it is empty", () => {
        const one = togglePlanning("* Task\nbody", 0, 0, "SCHEDULED", TODAY);
        expect(togglePlanning(one.text, 0, 0, "SCHEDULED", TODAY).text).toBe("* Task\nbody");
    });
    it("takes one keyword off and keeps the other", () => {
        const t = "* Task\nDEADLINE: <2026-10-24 Sat> SCHEDULED: <2026-10-25 Sun>";
        expect(togglePlanning(t, 0, 0, "SCHEDULED", TODAY).text).toBe("* Task\nDEADLINE: <2026-10-24 Sat>");
    });
    it("does nothing when there is no heading above the caret", () => {
        expect(togglePlanning("plain", 0, 0, "SCHEDULED", TODAY)).toEqual({ text: "plain", start: 0, end: 0 });
    });
    it("works on the last line of the text", () => {
        expect(togglePlanning("* Task", 3, 3, "DEADLINE", TODAY).text).toBe("* Task\nDEADLINE: <2026-10-24 Sat>");
    });
    it("uses the nearest heading above", () => {
        const e = togglePlanning("* A\n** B\ntext", 11, 11, "SCHEDULED", TODAY);
        expect(e.text).toBe("* A\n** B\nSCHEDULED: <2026-10-24 Sat>\ntext");
    });
});

describe("properties", () => {
    it("creates the drawer under the heading", () => {
        const e = addProperty("* Task\nbody", 0, 0);
        expect(e.text).toBe("* Task\n:PROPERTIES:\n:ID: \n:END:\nbody");
        expect(e.text.slice(0, e.start).endsWith(":ID: ")).toBe(true);
        expect(e.start).toBe(e.end);
    });
    it("goes after the planning line", () => {
        const e = addProperty("* Task\nSCHEDULED: <2026-10-24 Sat>\nbody", 0, 0, "CUSTOM_ID");
        expect(e.text).toBe("* Task\nSCHEDULED: <2026-10-24 Sat>\n:PROPERTIES:\n:CUSTOM_ID: \n:END:\nbody");
    });
    it("adds to an existing drawer, before :END:", () => {
        const t = "* Task\n:PROPERTIES:\n:A: 1\n:END:\nbody";
        const e = addProperty(t, 0, 0, "B");
        expect(e.text).toBe("* Task\n:PROPERTIES:\n:A: 1\n:B: \n:END:\nbody");
    });
    it("does not add a key twice: the caret goes to its line instead", () => {
        const t = "* Task\n:PROPERTIES:\n:ID: 42\n:END:";
        const e = addProperty(t, 0, 0);
        expect(e.text).toBe(t);
        expect(t.slice(0, e.start).endsWith(":ID: 42")).toBe(true);
    });
    it("with no heading above, the drawer goes at the top of the file", () => {
        const e = addProperty("plain", 0, 0);
        expect(e.text).toBe(":PROPERTIES:\n:ID: \n:END:\nplain");
    });
    it("the key is an option", () => {
        expect(addProperty("* T", 0, 0, "EMAIL").text).toContain(":EMAIL: ");
    });
    it("finds the heading from a line far below", () => {
        const t = "* A\nx\ny\nz";
        expect(addProperty(t, 9, 9).text.startsWith("* A\n:PROPERTIES:")).toBe(true);
    });
});

describe("contacts", () => {
    it("makes a heading with the property drawer, the selection as the name", () => {
        const e = insertContact("Ada Lovelace", 0, 12);
        expect(e.text).toBe("* Ada Lovelace\n:PROPERTIES:\n:EMAIL: \n:PHONE: \n:ADDRESS: \n:BIRTHDAY: \n:END:");
        expect(e.text.slice(0, e.start).endsWith(":EMAIL: ")).toBe(true);
    });
    it("one level under the heading above", () => {
        const e = insertContact("* People\n", 9, 9);
        expect(e.text.startsWith("* People\n** \n:PROPERTIES:")).toBe(true);
    });
    it("starts on its own line when the caret is mid-line", () => {
        const e = insertContact("abXcd", 2, 3, ["EMAIL"]);
        expect(e.text).toBe("ab\n* X\n:PROPERTIES:\n:EMAIL: \n:END:cd");
    });
    it("the properties are an option", () => {
        expect(insertContact("", 0, 0, ["NICKNAME"]).text).toBe("* \n:PROPERTIES:\n:NICKNAME: \n:END:");
    });
    it("no properties still gives a drawer", () => {
        expect(insertContact("A", 0, 1, []).text).toBe("* A\n:PROPERTIES:\n:END:");
    });
});

describe("applyTool and the tool table", () => {
    it("every tool id has a group", () => {
        for (const id of TOOL_IDS) expect(["structure", "task", "text", "data"]).toContain(TOOL_GROUPS[id]);
        expect(new Set(TOOL_IDS).size).toBe(TOOL_IDS.length);
        expect(Object.keys(TOOL_GROUPS).length).toBe(TOOL_IDS.length);
    });
    it("every tool runs on an empty text without throwing", () => {
        for (const id of TOOL_IDS) expect(() => applyTool(id, "", 0, 0, { today: "2026-10-24" })).not.toThrow();
    });
    it("every tool runs on a small document with the caret in the middle", () => {
        const doc = "* Task\nSCHEDULED: <2026-10-24 Sat>\n:PROPERTIES:\n:ID: 1\n:END:\nbody text\n";
        for (const id of TOOL_IDS) {
            const e = applyTool(id, doc, 40, 44, { today: "2026-10-24" });
            expect(e.start).toBeGreaterThanOrEqual(0);
            expect(e.end).toBeGreaterThanOrEqual(e.start);
            expect(e.end).toBeLessThanOrEqual(e.text.length);
        }
    });
    it("passes options through: level, keywords, today", () => {
        expect(applyTool("heading", "a", 0, 1, { headingLevel: 2 }).text).toBe("** a");
        expect(applyTool("todo", "* a", 0, 0, { todoKeywords: ["NEXT"] }).text).toBe("* NEXT a");
        expect(applyTool("timestamp", "", 0, 0, { today: "2026-01-01" }).text).toBe("<2026-01-01 Thu>");
    });
});
