import { describe, expect, test } from "vitest";

import { cellText, columnName, crc32, exportBlob, exportFilename, toCsv, toTsv, toXlsx } from "./export-data";

/** Reads a stored-only ZIP back into `{ name: text }`, checking every CRC. */
function unzip(bytes: Uint8Array): Record<string, string> {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const out: Record<string, string> = {};
    let at = bytes.length - 22;
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
        const dataStart = local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
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
        expect(toCsv(TABLE)).toBe('Name,Qty,Note\r\nAnn,3,"says ""hi"", twice"\r\nBo,2.5,"line\nbreak"\r\n');
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
        expect([0, 25, 26, 27, 51, 52, 701, 702].map(columnName)).toEqual(["A", "Z", "AA", "AB", "AZ", "BA", "ZZ", "AAA"]);
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
            toXlsx({ headers: ["A", "B", "C", "D"], rows: [["t & <u>", 7, true, new Date("2026-10-16T00:00:00Z")]] }),
        )["xl/worksheets/sheet1.xml"];
        expect(sheet).toContain('<c r="A1" s="3" t="inlineStr"><is><t xml:space="preserve">A</t></is></c>');
        expect(sheet).toContain('<c r="A2" t="inlineStr"><is><t xml:space="preserve">t &amp; &lt;u&gt;</t></is></c>');
        expect(sheet).toContain('<c r="B2"><v>7</v></c>');
        expect(sheet).toContain('<c r="C2" t="b"><v>1</v></c>');
        expect(sheet).toContain('<c r="D2" s="1"><v>46311</v></c>'); // 2026-10-16
        expect(sheet).toContain('state="frozen"');
    });

    test("§8.64 a formula-looking string stays text; empty cells are omitted; XML-illegal characters are dropped", () => {
        const sheet = unzip(toXlsx({ headers: ["A", "B"], rows: [["=1+1", null], ["a\u0001b", "x"]] }), )["xl/worksheets/sheet1.xml"];
        expect(sheet).toContain('t="inlineStr"><is><t xml:space="preserve">=1+1</t>');
        expect(sheet).not.toContain('r="B2"');
        expect(sheet).toContain(">ab<");
    });

    test("§8.65 the sheet name is cleaned and cut to 31 characters; the output is reproducible", () => {
        const a = toXlsx(TABLE, { sheetName: "Q4: sales/2026 [final] with a very long name indeed" });
        expect(unzip(a)["xl/workbook.xml"]).toMatch(/<sheet name="Q4 sales 2026 final with a very" /);
        expect(Array.from(toXlsx(TABLE))).toEqual(Array.from(toXlsx(TABLE)));
    });
});

describe("files (§8.66)", () => {
    test("§8.66 exportBlob types the blob; CSV and TSV carry a BOM; exportFilename adds the extension once and cleans the name", async () => {
        expect(exportBlob(TABLE, "xlsx").type).toContain("spreadsheetml.sheet");
        const csv = exportBlob(TABLE, "csv");
        expect(csv.type).toBe("text/csv;charset=utf-8");
        expect(new Uint8Array(await csv.arrayBuffer()).slice(0, 3)).toEqual(new Uint8Array([0xef, 0xbb, 0xbf]));
        expect(exportFilename("report", "csv")).toBe("report.csv");
        expect(exportFilename("report.CSV", "csv")).toBe("report.CSV");
        expect(exportFilename("a/b:c", "xlsx")).toBe("a-b-c.xlsx");
        expect(exportFilename("  ", "tsv")).toBe("export.tsv");
    });
});

describe("non-ASCII text (§8.78)", () => {
    test("§8.78 Japanese, accented and emoji text survives CSV, TSV and xlsx unchanged", async () => {
        const table = { headers: ["名前", "Café"], rows: [["にほんご 日本語", "naïve 🌸"]] };
        const decode = async (blob: Blob) => new TextDecoder("utf-8", { ignoreBOM: true }).decode(await blob.arrayBuffer());
        expect(await decode(exportBlob(table, "csv"))).toBe("\uFEFF名前,Café\r\nにほんご 日本語,naïve 🌸\r\n");
        expect(await decode(exportBlob(table, "tsv"))).toBe("\uFEFF名前\tCafé\r\nにほんご 日本語\tnaïve 🌸\r\n");
        const sheet = unzip(toXlsx(table))["xl/worksheets/sheet1.xml"];
        expect(sheet).toContain(">名前<");
        expect(sheet).toContain(">にほんご 日本語<");
        expect(sheet).toContain(">naïve 🌸<");
        expect(exportFilename("売上 2026", "csv")).toBe("売上 2026.csv");
    });
});

