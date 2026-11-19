// Property tests (fast-check): a CSV or TSV export reads back as the cells that went in, and a safe export never
// starts a cell with a character a spreadsheet would run as a formula.
import fc from "fast-check";
import { describe, expect, test } from "vitest";

import { cellText, toDelimited } from "./export-data";

/**
 * RFC 4180 reader: quoted fields may hold the delimiter, quotes (doubled) and line breaks. Rows end in \r\n; an
 * unquoted lone \r or \n also ends a row, as it does in a spreadsheet, so a field holding one must be quoted.
 */
function parseDelimited(text: string, delimiter: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = "";
    let quoted = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i]!;
        if (quoted) {
            if (ch === '"' && text[i + 1] === '"') {
                field += '"';
                i++;
            } else if (ch === '"') quoted = false;
            else field += ch;
        } else if (ch === '"') quoted = true;
        else if (ch === delimiter) {
            row.push(field);
            field = "";
        } else if (ch === "\r" || ch === "\n") {
            row.push(field);
            rows.push(row);
            row = [];
            field = "";
            if (ch === "\r" && text[i + 1] === "\n") i++;
        } else field += ch;
    }
    return rows;
}

// Any text, including quotes, delimiters, line breaks and characters outside the BMP.
const cell = fc.oneof(
    fc.string(),
    fc.constantFrom('"', ",", "\t", "\n", "\r", "a\rb", "\r\n", '""', "a,b", "=1+1", "+", "-", "@"),
);
const table = fc.integer({ min: 1, max: 5 }).chain((cols) =>
    fc.record({
        headers: fc.array(cell, { minLength: cols, maxLength: cols }),
        rows: fc.array(fc.array(cell, { minLength: cols, maxLength: cols }), { maxLength: 6 }),
    }),
);
const delimiter = fc.constantFrom(",", "\t");

describe("export-data (properties)", () => {
    test("an unsafe export reads back as exactly the cells that went in", () => {
        fc.assert(
            fc.property(table, delimiter, (t, d) => {
                const out = toDelimited(t, { delimiter: d, safe: false });
                expect(parseDelimited(out, d)).toEqual([t.headers, ...t.rows]);
            }),
        );
    });

    test("a safe export reads back as each cell's safe text, which never starts a formula", () => {
        fc.assert(
            fc.property(table, delimiter, (t, d) => {
                const out = toDelimited(t, { delimiter: d });
                const back = parseDelimited(out, d);
                expect(back).toEqual(
                    [t.headers, ...t.rows].map((r) => r.map((v) => cellText(v, true))),
                );
                for (const r of back) for (const v of r) expect(v).not.toMatch(/^[=+\-@\t\r]/);
            }),
        );
    });

    test("every row has one field per header", () => {
        fc.assert(
            fc.property(table, delimiter, (t, d) =>
                parseDelimited(toDelimited(t, { delimiter: d }), d).every(
                    (r) => r.length === t.headers.length,
                ),
            ),
        );
    });
});
