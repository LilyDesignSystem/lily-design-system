// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";

import {
    cellText,
    columnName,
    crc32,
    downloadBlob,
    exportBlob,
    copyToClipboard,
    exportFilename,
    isExportFormula,
    toClipboardText,
    toCsv,
    toTsv,
    toXlsx,
} from "./export-data";

/** Reads a stored-only ZIP back into `{ name: text }`, checking every CRC. */
function unzip(bytes: Uint8Array): Record<string, string> {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const out: Record<string, string> = {};
    const at = bytes.length - 22;
    expect(view.getUint32(at, true)).toBe(0x06054b50);
    const count = view.getUint16(at + 10, true);
    let entry = view.getUint32(at + 16, true);
    const decoder = new TextDecoder();
    for (let i = 0; i < count; i++) {
        expect(view.getUint32(entry, true)).toBe(0x02014b50);
        const crc = view.getUint32(entry + 16, true);
        const size = view.getUint32(entry + 24, true);
        const nameLength = view.getUint16(entry + 28, true);
        const local = view.getUint32(entry + 42, true);
        const name = decoder.decode(bytes.subarray(entry + 46, entry + 46 + nameLength));
        expect(view.getUint32(local, true)).toBe(0x04034b50);
        expect(view.getUint16(local + 8, true)).toBe(0); // stored
        const dataStart =
            local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
        const data = bytes.subarray(dataStart, dataStart + size);
        expect(crc32(data)).toBe(crc);
        out[name] = decoder.decode(data);
        entry += 46 + nameLength;
    }
    return out;
}

const TABLE = {
    headers: ["Name", "Qty", "Note"],
    rows: [
        ["Ann", 3, 'says "hi", twice'],
        ["Bo", 2.5, "line\nbreak"],
    ],
};

describe("CSV and TSV (§8.57–§8.60)", () => {
    test("§8.57 CSV: CRLF lines, a header, quoting for commas, quotes and line breaks", () => {
        expect(toCsv(TABLE)).toBe(
            'Name,Qty,Note\r\nAnn,3,"says ""hi"", twice"\r\nBo,2.5,"line\nbreak"\r\n',
        );
    });

    test("§8.58 TSV uses tabs and does not quote commas", () => {
        expect(toTsv({ headers: ["a", "b"], rows: [["x,y", "z"]] })).toBe("a\tb\r\nx,y\tz\r\n");
        expect(toTsv({ headers: ["a"], rows: [["has\ttab"]] })).toBe('a\r\n"has\ttab"\r\n');
    });

    test("§8.59 formula-safe by default for strings only; numbers are untouched; header and BOM options", () => {
        expect(cellText("=SUM(A1)")).toBe("'=SUM(A1)");
        expect(cellText("+1")).toBe("'+1");
        expect(cellText("-x")).toBe("'-x");
        expect(cellText("@a")).toBe("'@a");
        expect(cellText(-5)).toBe("-5");
        expect(cellText("=1", false)).toBe("=1");
        expect(toCsv(TABLE, { header: false, bom: true }).startsWith("﻿Ann,")).toBe(true);
    });

    test("§8.60 booleans, dates and empty cells", () => {
        expect(cellText(true)).toBe("TRUE");
        expect(cellText(new Date("2026-10-16T00:00:00Z"))).toBe("2026-10-16");
        expect(cellText(new Date("2026-10-16T12:30:00Z"))).toBe("2026-10-16T12:30:00.000Z");
        expect(cellText(null)).toBe("");
        expect(cellText(undefined)).toBe("");
        expect(cellText(Number.NaN)).toBe("");
        expect(toCsv({ headers: ["a", "b"], rows: [[null, "x"]] })).toBe("a,b\r\n,x\r\n");
    });
});

describe("Excel .xlsx (§8.61–§8.65)", () => {
    test("§8.61 columnName counts A…Z, AA…", () => {
        expect([0, 25, 26, 27, 51, 52, 701, 702].map(columnName)).toEqual([
            "A",
            "Z",
            "AA",
            "AB",
            "AZ",
            "BA",
            "ZZ",
            "AAA",
        ]);
    });

    test("§8.62 a valid ZIP of the parts a workbook needs, every CRC right", () => {
        const files = unzip(toXlsx(TABLE));
        expect(Object.keys(files).sort()).toEqual([
            "[Content_Types].xml",
            "_rels/.rels",
            "xl/_rels/workbook.xml.rels",
            "xl/styles.xml",
            "xl/workbook.xml",
            "xl/worksheets/sheet1.xml",
        ]);
        expect(files["xl/workbook.xml"]).toContain('<sheet name="Sheet1"');
    });

    test("§8.63 cells keep their types: text inline, numbers numeric, booleans and dates typed; the header is bold and frozen", () => {
        const sheet = unzip(
            toXlsx({
                headers: ["A", "B", "C", "D"],
                rows: [["t & <u>", 7, true, new Date("2026-10-16T00:00:00Z")]],
            }),
        )["xl/worksheets/sheet1.xml"];
        expect(sheet).toContain(
            '<c r="A1" s="3" t="inlineStr"><is><t xml:space="preserve">A</t></is></c>',
        );
        expect(sheet).toContain(
            '<c r="A2" t="inlineStr"><is><t xml:space="preserve">t &amp; &lt;u&gt;</t></is></c>',
        );
        expect(sheet).toContain('<c r="B2"><v>7</v></c>');
        expect(sheet).toContain('<c r="C2" t="b"><v>1</v></c>');
        expect(sheet).toContain('<c r="D2" s="1"><v>46311</v></c>'); // 2026-10-16
        expect(sheet).toContain('state="frozen"');
    });

    test("§8.64 a formula-looking string stays text; empty cells are omitted; XML-illegal characters are dropped", () => {
        const sheet = unzip(
            toXlsx({
                headers: ["A", "B"],
                rows: [
                    ["=1+1", null],
                    ["a\u0001b", "x"],
                ],
            }),
        )["xl/worksheets/sheet1.xml"];
        expect(sheet).toContain('t="inlineStr"><is><t xml:space="preserve">=1+1</t>');
        expect(sheet).not.toContain('r="B2"');
        expect(sheet).toContain(">ab<");
    });

    test("§8.65 the sheet name is cleaned and cut to 31 characters; the output is reproducible", () => {
        const a = toXlsx(TABLE, {
            sheetName: "Q4: sales/2026 [final] with a very long name indeed",
        });
        expect(unzip(a)["xl/workbook.xml"]).toMatch(
            /<sheet name="Q4 sales 2026 final with a very" /,
        );
        expect(Array.from(toXlsx(TABLE))).toEqual(Array.from(toXlsx(TABLE)));
    });
});

describe("files (§8.66)", () => {
    test("§8.66 exportBlob types the blob; CSV and TSV carry a BOM; exportFilename adds the extension once and cleans the name", async () => {
        expect(exportBlob(TABLE, "xlsx").type).toContain("spreadsheetml.sheet");
        const csv = exportBlob(TABLE, "csv");
        expect(csv.type).toBe("text/csv;charset=utf-8");
        expect(new Uint8Array(await csv.arrayBuffer()).slice(0, 3)).toEqual(
            new Uint8Array([0xef, 0xbb, 0xbf]),
        );
        expect(exportFilename("report", "csv")).toBe("report.csv");
        expect(exportFilename("report.CSV", "csv")).toBe("report.CSV");
        expect(exportFilename("a/b:c", "xlsx")).toBe("a-b-c.xlsx");
        expect(exportFilename("  ", "tsv")).toBe("export.tsv");
    });
});

describe("non-ASCII text (§8.78)", () => {
    test("§8.78 Japanese, accented and emoji text survives CSV, TSV and xlsx unchanged", async () => {
        const table = { headers: ["名前", "Café"], rows: [["にほんご 日本語", "naïve 🌸"]] };
        const decode = async (blob: Blob) =>
            new TextDecoder("utf-8", { ignoreBOM: true }).decode(await blob.arrayBuffer());
        expect(await decode(exportBlob(table, "csv"))).toBe(
            "\uFEFF名前,Café\r\nにほんご 日本語,naïve 🌸\r\n",
        );
        expect(await decode(exportBlob(table, "tsv"))).toBe(
            "\uFEFF名前\tCafé\r\nにほんご 日本語\tnaïve 🌸\r\n",
        );
        const sheet = unzip(toXlsx(table))["xl/worksheets/sheet1.xml"];
        expect(sheet).toContain(">名前<");
        expect(sheet).toContain(">にほんご 日本語<");
        expect(sheet).toContain(">naïve 🌸<");
        expect(exportFilename("売上 2026", "csv")).toBe("売上 2026.csv");
    });

    test("§8.115 a formula cell keeps its expression with the result cached in .xlsx; CSV and TSV carry only the result", () => {
        const table = {
            headers: ["Sum", "Text", "Flag", "Empty", "Date"],
            rows: [
                [
                    { formula: "=1+2", result: 3 },
                    { formula: '="a"&"<b>"', result: "a<b>" },
                    { formula: "=TRUE", result: true },
                    { formula: "=A9", result: null },
                    { formula: "=DATE(2026,10,16)", result: new Date("2026-10-16T00:00:00Z") },
                ],
            ],
        };
        const sheet = unzip(toXlsx(table))["xl/worksheets/sheet1.xml"];
        expect(sheet).toContain('<c r="A2"><f>1+2</f><v>3</v></c>');
        expect(sheet).toContain(
            '<c r="B2" t="str"><f>"a"&amp;"&lt;b&gt;"</f><v>a&lt;b&gt;</v></c>',
        );
        expect(sheet).toContain('<c r="C2" t="b"><f>TRUE</f><v>1</v></c>');
        expect(sheet).toContain('<c r="D2"><f>A9</f></c>');
        expect(sheet).toMatch(/<c r="E2" s="1"><f>DATE\(2026,10,16\)<\/f><v>\d+<\/v><\/c>/);
        expect(toCsv(table)).toBe("Sum,Text,Flag,Empty,Date\r\n3,a<b>,TRUE,,2026-10-16\r\n");
        expect(isExportFormula({ formula: "=1", result: 1 })).toBe(true);
        expect(isExportFormula({ formula: "=1" })).toBe(false);
    });
});

describe("clipboard", () => {
    const table = {
        headers: ["Name", "Note"],
        rows: [
            ["Ann", "a\tb"],
            ["=SUM(1)", "x"],
        ],
    };

    test("toClipboardText is tab-separated with a header row, no BOM, formulas defused", () => {
        const text = toClipboardText(table);
        expect(text.startsWith("\uFEFF")).toBe(false);
        expect(text.split("\r\n")[0]).toBe("Name\tNote");
        expect(text).toContain("'=SUM(1)");
    });

    test("copyToClipboard uses the async Clipboard API when there is one", async () => {
        const writeText = vi.fn(async () => {});
        vi.stubGlobal("navigator", { clipboard: { writeText } });
        expect(await copyToClipboard("hello")).toBe(true);
        expect(writeText).toHaveBeenCalledWith("hello");
        vi.unstubAllGlobals();
    });

    test("copyToClipboard falls back to a hidden textarea and execCommand", async () => {
        vi.stubGlobal("navigator", {});
        const exec = vi.fn(() => true);
        (document as unknown as { execCommand: unknown }).execCommand = exec;
        expect(await copyToClipboard("hi")).toBe(true);
        expect(exec).toHaveBeenCalledWith("copy");
        expect(document.querySelector("textarea")).toBeNull();
        vi.unstubAllGlobals();
    });

    test("copyToClipboard resolves false, never throws, when neither path works", async () => {
        vi.stubGlobal("navigator", {
            clipboard: {
                writeText: async () => {
                    throw new Error("denied");
                },
            },
        });
        (document as unknown as { execCommand: unknown }).execCommand = () => false;
        expect(await copyToClipboard("x")).toBe(false);
        vi.unstubAllGlobals();
    });
});

describe("edges: invalid dates, the download link, a clipboard with no DOM", () => {
    test("an invalid date is an empty cell in text and in a sheet", () => {
        expect(cellText(new Date("not a date"))).toBe("");
        const sheet = unzip(toXlsx({ headers: ["A", "B"], rows: [[new Date("nope"), 1]] }))[
            "xl/worksheets/sheet1.xml"
        ];
        expect(sheet).not.toContain('r="A2"');
        expect(sheet).toContain('<c r="B2"><v>1</v></c>');
    });

    test("downloadBlob clicks a temporary hidden link, then revokes the URL later", () => {
        vi.useFakeTimers();
        const create = vi.fn(() => "blob:lily/1");
        const revoke = vi.fn();
        vi.stubGlobal(
            "URL",
            Object.assign(URL, { createObjectURL: create, revokeObjectURL: revoke }),
        );
        const clicked: { href: string; download: string; hidden: boolean; attached: boolean }[] =
            [];
        const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
            this: HTMLAnchorElement,
        ) {
            clicked.push({
                href: this.href,
                download: this.download,
                hidden: this.style.display === "none",
                attached: this.isConnected,
            });
        });
        downloadBlob(new Blob(["x"]), "people.csv");
        expect(clicked).toEqual([
            { href: "blob:lily/1", download: "people.csv", hidden: true, attached: true },
        ]);
        expect(document.querySelector("a")).toBeNull();
        expect(revoke).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1000);
        expect(revoke).toHaveBeenCalledWith("blob:lily/1");
        click.mockRestore();
        vi.unstubAllGlobals();
        vi.useRealTimers();
    });

    test("downloadBlob does nothing where object URLs are missing", () => {
        const saved = URL.createObjectURL;
        (URL as unknown as { createObjectURL?: unknown }).createObjectURL = undefined;
        const click = vi.spyOn(HTMLAnchorElement.prototype, "click");
        downloadBlob(new Blob(["x"]), "a.csv");
        expect(click).not.toHaveBeenCalled();
        click.mockRestore();
        URL.createObjectURL = saved;
    });

    test("copyToClipboard resolves false when the textarea path itself throws", async () => {
        vi.stubGlobal("navigator", {});
        const create = vi.spyOn(document, "createElement").mockImplementation(() => {
            throw new Error("no DOM");
        });
        expect(await copyToClipboard("x")).toBe(false);
        create.mockRestore();
        vi.unstubAllGlobals();
    });
});

describe("edge cases of each format", () => {
    test("false is FALSE, and a table with no header and no rows is an empty file", () => {
        expect(cellText(false)).toBe("FALSE");
        expect(toCsv({ headers: ["A"], rows: [] }, { header: false })).toBe("");
    });

    test("a sheet name of only forbidden characters becomes Sheet1", () => {
        const files = unzip(toXlsx({ headers: ["A"], rows: [] }, { sheetName: "[:*?/]" }));
        expect(files["xl/workbook.xml"]).toContain('<sheet name="Sheet1"');
    });

    test("xlsx: a false result, a formula dated with a time of day, a timed date, an infinite number and a false cell", () => {
        const at = new Date("2026-11-26T12:00:00Z");
        const sheet = unzip(
            toXlsx(
                {
                    headers: ["A", "B", "C", "D", "E"],
                    rows: [
                        [
                            { formula: "=1>2", result: false },
                            { formula: "=NOW()", result: at },
                            at,
                            Infinity,
                            false,
                        ],
                    ],
                },
                { header: false },
            ),
        )["xl/worksheets/sheet1.xml"];
        expect(sheet).toContain('<c r="A1" t="b"><f>1&gt;2</f><v>0</v></c>');
        expect(sheet).toMatch(/<c r="B1" s="2"><f>NOW\(\)<\/f><v>[\d.]+<\/v><\/c>/);
        expect(sheet).toMatch(/<c r="C1" s="2"><v>[\d.]+<\/v><\/c>/);
        expect(sheet).not.toContain('r="D1"');
        expect(sheet).toContain('<c r="E1" t="b"><v>0</v></c>');
        // No header row: no frozen pane.
        expect(sheet).not.toContain("<pane");
    });
});
