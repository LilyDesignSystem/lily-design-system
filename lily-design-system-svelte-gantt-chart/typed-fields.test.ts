import { describe, expect, test } from "vitest";

import {
    draftOf,
    editorKind,
    evaluateEdit,
    exportFieldCell,
    exportableFields,
    fieldText,
    fieldValue,
    isEditableField,
    neighbourField,
    parseDraft,
    resolveFields,
} from "./typed-fields";

const FIELDS = resolveFields(
    [
        { id: "name", header: "Name" },
        { id: "qty", header: "Qty", type: "number" },
        { id: "due", header: "Due", type: "date" },
        { id: "owner", header: "Owner", type: "select", options: [{ id: "a", label: "Ann" }] },
        { id: "site", header: "Site", type: "link" },
        { id: "calc", header: "Calc", type: "rollup", exportable: false },
    ],
    "en",
);
const by = (id: string) => FIELDS.find((f) => f.id === id)!;

describe("typed-fields", () => {
    test("resolveFields fills in type defaults and tolerates no fields", () => {
        expect(resolveFields(undefined)).toEqual([]);
        expect(by("qty").align).toBe("end");
        expect(by("owner").format?.("a", {})).toBe("Ann");
    });

    test("fieldValue reads values[id] or the accessor; fieldText formats and is empty for no value", () => {
        expect(fieldValue(by("qty"), { qty: 3 })).toBe(3);
        expect(fieldValue(by("qty"), undefined)).toBeUndefined();
        expect(fieldText(by("owner"), { owner: "a" })).toBe("Ann");
        expect(fieldText(by("owner"), {})).toBe("");
        expect(fieldText(by("name"), { name: "x" })).toBe("x");
        expect(fieldText(by("name"), { name: "" })).toBe("");
    });

    test("only text-like and chosen types are editable; editable false opts out; editorKind follows the type or the override", () => {
        expect(isEditableField(by("name"))).toBe(true);
        expect(isEditableField(by("calc"))).toBe(false);
        expect(isEditableField({ id: "x", header: "X", editable: false })).toBe(false);
        expect(editorKind(by("qty"))).toBe("number");
        expect(editorKind({ id: "x", header: "X", editor: "date" })).toBe("date");
        expect(editorKind(by("name"))).toBe("text");
    });

    test("draftOf gives the editor's starting text, a link's address", () => {
        expect(draftOf(by("qty"), { qty: 3 })).toBe("3");
        expect(draftOf(by("qty"), {})).toBe("");
        expect(draftOf(by("site"), { site: { href: "https://x.test", label: "X" } })).toBe("https://x.test");
        expect(draftOf(by("site"), { site: "https://y.test" })).toBe("https://y.test");
    });

    test("parseDraft turns text into the typed value; a number input's own number is accepted; a custom parse wins", () => {
        expect(parseDraft(by("qty"), "8")).toBe(8);
        expect(parseDraft(by("qty"), 8)).toBe(8);
        expect(parseDraft(by("qty"), null)).toBeNull();
        expect(parseDraft(by("qty"), " ")).toBeNull();
        expect(parseDraft(by("due"), "")).toBeNull();
        expect(parseDraft(by("due"), "2026-10-16")).toBe("2026-10-16");
        expect(parseDraft(by("name"), "hi")).toBe("hi");
        expect(parseDraft({ ...by("qty"), parse: (d) => d.length }, "abcd")).toBe(4);
    });

    test("evaluateEdit refuses what does not fit the type, and reports changed / unchanged with the text", () => {
        expect(evaluateEdit({ ...by("qty"), parse: () => Number.NaN }, { qty: 1 }, "x")).toEqual({ invalid: true });
        expect(evaluateEdit(by("due"), {}, "not-a-date")).toEqual({ invalid: true });
        expect(evaluateEdit(by("owner"), {}, "zzz")).toEqual({ invalid: true });
        expect(evaluateEdit(by("qty"), { qty: 3 }, "8")).toEqual({ invalid: false, value: 8, previous: 3, changed: true, text: "8" });
        expect(evaluateEdit(by("qty"), { qty: 3 }, "3")).toMatchObject({ invalid: false, changed: false });
        expect(evaluateEdit(by("qty"), { qty: 3 }, "")).toMatchObject({ invalid: false, value: null, changed: true, text: "" });
    });

    test("exportFieldCell keeps numbers, booleans and dates typed and shows the rest as text; exportValue wins; exportable false is dropped", () => {
        expect(exportFieldCell(by("qty"), { qty: 3 })).toBe(3);
        expect(exportFieldCell(by("qty"), {})).toBeNull();
        expect(exportFieldCell(by("owner"), { owner: "a" })).toBe("Ann");
        const when = new Date(0);
        expect(exportFieldCell(by("name"), { name: when })).toBe(when);
        expect(exportFieldCell({ ...by("name"), exportValue: () => "X" }, { name: "n" })).toBe("X");
        expect(exportableFields(FIELDS).map((f) => f.id)).toEqual(["name", "qty", "due", "owner", "site"]);
    });

    test("neighbourField steps through the editable fields and stops at the ends", () => {
        const editable = FIELDS.filter(isEditableField);
        expect(neighbourField(editable, "name", false)?.id).toBe("qty");
        expect(neighbourField(editable, "qty", true)?.id).toBe("name");
        expect(neighbourField(editable, "name", true)).toBeUndefined();
        expect(neighbourField(editable, "site", false)).toBeUndefined();
    });
});
