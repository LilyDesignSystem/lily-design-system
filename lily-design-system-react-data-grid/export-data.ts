// Table export for DataGrid: CSV, TSV and Excel (.xlsx), as pure functions.
//
// Nothing here knows about the grid. A table is a header row plus rows of
// cell values, and every function turns one into text or bytes, so a consumer
// who wants their own export button (or a server-side export) can call them
// directly. DataGrid's own buttons are a thin layer on top.
//
// The .xlsx writer has no dependencies: a workbook is a ZIP of a few XML
// parts, and the ZIP here only *stores* (no compression), which Excel,
// LibreOffice, Numbers and Google Sheets all read. Entries carry a fixed
// timestamp, so the same table always produces the same bytes.

export type ExportFormat = "csv" | "tsv" | "xlsx";

/** A header row and rows of cell values. A cell is a string, number, boolean, `Date`, or empty. */
export type ExportTable = {
    headers: string[];
    rows: unknown[][];
};

export type DelimitedOptions = {
    /** Field separator. Default `","` (use `"\t"` for TSV). */
    delimiter?: string;
    /** Write the header row. Default true. */
    header?: boolean;
    /** Prefix a UTF-8 byte-order mark so Excel opens the file as UTF-8. Default false. */
    bom?: boolean;
    /** Defuse spreadsheet formulas: a string starting with `=`, `+`, `-`, `@`, tab or CR gets a leading `'`. Default true. */
    safe?: boolean;
    /** Line ending. Default `"\r\n"` (RFC 4180). */
    eol?: string;
};

export type XlsxOptions = {
    /** Worksheet name (31 characters at most; `[]:*?/\` are replaced). Default `"Sheet1"`. */
    sheetName?: string;
    /** Write the header row, in bold. Default true. */
    header?: boolean;
};

export const MIME_TYPES: Record<ExportFormat, string> = {
    csv: "text/csv;charset=utf-8",
    tsv: "text/tab-separated-values;charset=utf-8",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

// ---------------------------------------------------------------------
// Delimited text (CSV / TSV)
// ---------------------------------------------------------------------

const FORMULA_START = /^[=+\-@\t\r]/;

/** One cell as text. Numbers and booleans are never treated as formulas; only strings are defused. */
export function cellText(value: unknown, safe = true): string {
    if (value === null || value === undefined) return "";
    if (value instanceof Date) {
        if (Number.isNaN(value.getTime())) return "";
        // A date at exactly UTC midnight is a civil date: write it without a time of day.
        const iso = value.toISOString();
        return iso.endsWith("T00:00:00.000Z") ? iso.slice(0, 10) : iso;
    }
    if (typeof value === "number") return Number.isFinite(value) ? String(value) : "";
    if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
    const text = String(value);
    return safe && FORMULA_START.test(text) ? `'${text}` : text;
}

function quoteField(text: string, delimiter: string): string {
    return text.includes(delimiter) || /["\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** CSV/TSV text for a table. Fields containing the delimiter, a quote or a line break are quoted. */
export function toDelimited(table: ExportTable, options: DelimitedOptions = {}): string {
    const { delimiter = ",", header = true, bom = false, safe = true, eol = "\r\n" } = options;
    const lines: string[] = [];
    if (header) lines.push(table.headers.map((h) => quoteField(cellText(h, safe), delimiter)).join(delimiter));
    for (const row of table.rows) {
        lines.push(table.headers.map((_, i) => quoteField(cellText(row[i], safe), delimiter)).join(delimiter));
    }
    return (bom ? "﻿" : "") + lines.join(eol) + (lines.length > 0 ? eol : "");
}

export function toCsv(table: ExportTable, options: Omit<DelimitedOptions, "delimiter"> = {}): string {
    return toDelimited(table, { ...options, delimiter: "," });
}

export function toTsv(table: ExportTable, options: Omit<DelimitedOptions, "delimiter"> = {}): string {
    return toDelimited(table, { ...options, delimiter: "\t" });
}

// ---------------------------------------------------------------------
// Excel (.xlsx)
// ---------------------------------------------------------------------

const encoder = new TextEncoder();

/** XML text with the characters XML 1.0 forbids removed. */
function xmlEscape(text: string): string {
    return text
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/** Column index (0-based) to a spreadsheet column name: 0 → A, 25 → Z, 26 → AA. */
export function columnName(index: number): string {
    let n = index;
    let name = "";
    do {
        name = String.fromCharCode(65 + (n % 26)) + name;
        n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    return name;
}

/** Days since 1899-12-30 (Excel's day 0, with its 1900 leap-year quirk absorbed), with the time of day as a fraction. */
function excelSerial(date: Date): number {
    return date.getTime() / 86_400_000 + 25_569;
}

function sheetNameFor(name: string): string {
    const cleaned = name.replace(/[[\]:*?/\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, 31);
    return cleaned || "Sheet1";
}

// Cell styles: 0 default, 1 date, 2 date and time, 3 bold (headers).
const STYLES_XML =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<numFmts count="2"><numFmt numFmtId="164" formatCode="yyyy\\-mm\\-dd"/><numFmt numFmtId="165" formatCode="yyyy\\-mm\\-dd\\ hh:mm:ss"/></numFmts>' +
    '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>' +
    '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>' +
    '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="4">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
    '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
    "</cellXfs>" +
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
    "</styleSheet>";

function cellXml(ref: string, value: unknown, headerStyle = false): string {
    if (value === null || value === undefined) return "";
    const s = headerStyle ? ' s="3"' : "";
    if (value instanceof Date) {
        if (Number.isNaN(value.getTime())) return "";
        const timeOfDay = value.getTime() % 86_400_000 !== 0;
        return `<c r="${ref}" s="${timeOfDay ? 2 : 1}"><v>${excelSerial(value)}</v></c>`;
    }
    if (typeof value === "number") return Number.isFinite(value) ? `<c r="${ref}"${s}><v>${value}</v></c>` : "";
    if (typeof value === "boolean") return `<c r="${ref}"${s} t="b"><v>${value ? 1 : 0}</v></c>`;
    // A string is stored as text, so it is never read as a formula.
    return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${xmlEscape(String(value))}</t></is></c>`;
}

function sheetXml(table: ExportTable, header: boolean): string {
    const rows: string[] = [];
    let rowNumber = 0;
    if (header) {
        rowNumber += 1;
        rows.push(
            `<row r="${rowNumber}">${table.headers.map((h, i) => cellXml(`${columnName(i)}${rowNumber}`, h, true)).join("")}</row>`,
        );
    }
    for (const row of table.rows) {
        rowNumber += 1;
        const cells = table.headers.map((_, i) => cellXml(`${columnName(i)}${rowNumber}`, row[i])).join("");
        rows.push(`<row r="${rowNumber}">${cells}</row>`);
    }
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        (header && table.headers.length > 0 ? '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' : "") +
        `<sheetData>${rows.join("")}</sheetData></worksheet>`
    );
}

/** An .xlsx workbook with one worksheet, as bytes. */
export function toXlsx(table: ExportTable, options: XlsxOptions = {}): Uint8Array {
    const { sheetName = "Sheet1", header = true } = options;
    const files: Record<string, string> = {
        "[Content_Types].xml":
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
            '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
            '<Default Extension="xml" ContentType="application/xml"/>' +
            '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
            '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
            '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
            "</Types>",
        "_rels/.rels":
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
            "</Relationships>",
        "xl/workbook.xml":
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
            `<sheets><sheet name="${xmlEscape(sheetNameFor(sheetName))}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
        "xl/_rels/workbook.xml.rels":
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
            '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
            "</Relationships>",
        "xl/styles.xml": STYLES_XML,
        "xl/worksheets/sheet1.xml": sheetXml(table, header),
    };
    return zipStore(Object.entries(files).map(([name, text]) => ({ name, data: encoder.encode(text) })));
}

// ---------------------------------------------------------------------
// ZIP (store only)
// ---------------------------------------------------------------------

let crcTable: Uint32Array | undefined;

export function crc32(bytes: Uint8Array): number {
    if (!crcTable) {
        crcTable = new Uint32Array(256);
        for (let n = 0; n < 256; n++) {
            let c = n;
            for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
            crcTable[n] = c >>> 0;
        }
    }
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
}

// 1980-01-01 00:00:00, the ZIP epoch: a fixed stamp keeps the output reproducible.
const DOS_TIME = 0x0000;
const DOS_DATE = 0x0021;

/** A ZIP archive holding `entries` uncompressed. */
export function zipStore(entries: { name: string; data: Uint8Array }[]): Uint8Array {
    const parts: Uint8Array[] = [];
    const central: Uint8Array[] = [];
    let offset = 0;
    for (const { name, data } of entries) {
        const nameBytes = encoder.encode(name);
        const crc = crc32(data);
        const local = new DataView(new ArrayBuffer(30));
        local.setUint32(0, 0x04034b50, true);
        local.setUint16(4, 20, true); // version needed
        local.setUint16(6, 0x0800, true); // flags: UTF-8 names
        local.setUint16(8, 0, true); // method: stored
        local.setUint16(10, DOS_TIME, true);
        local.setUint16(12, DOS_DATE, true);
        local.setUint32(14, crc, true);
        local.setUint32(18, data.length, true);
        local.setUint32(22, data.length, true);
        local.setUint16(26, nameBytes.length, true);
        local.setUint16(28, 0, true);
        parts.push(new Uint8Array(local.buffer), nameBytes, data);

        const entry = new DataView(new ArrayBuffer(46));
        entry.setUint32(0, 0x02014b50, true);
        entry.setUint16(4, 20, true); // version made by
        entry.setUint16(6, 20, true); // version needed
        entry.setUint16(8, 0x0800, true);
        entry.setUint16(10, 0, true);
        entry.setUint16(12, DOS_TIME, true);
        entry.setUint16(14, DOS_DATE, true);
        entry.setUint32(16, crc, true);
        entry.setUint32(20, data.length, true);
        entry.setUint32(24, data.length, true);
        entry.setUint16(28, nameBytes.length, true);
        entry.setUint32(42, offset, true);
        central.push(new Uint8Array(entry.buffer), nameBytes);

        offset += 30 + nameBytes.length + data.length;
    }
    const centralSize = central.reduce((n, p) => n + p.length, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, entries.length, true);
    end.setUint16(10, entries.length, true);
    end.setUint32(12, centralSize, true);
    end.setUint32(16, offset, true);
    const all = [...parts, ...central, new Uint8Array(end.buffer)];
    const out = new Uint8Array(all.reduce((n, p) => n + p.length, 0));
    let at = 0;
    for (const p of all) {
        out.set(p, at);
        at += p.length;
    }
    return out;
}

// ---------------------------------------------------------------------
// Files
// ---------------------------------------------------------------------

/** The file for `table` in `format`, as a `Blob`. CSV and TSV carry a UTF-8 byte-order mark so Excel reads them as UTF-8. */
export function exportBlob(table: ExportTable, format: ExportFormat, options: { sheetName?: string; header?: boolean } = {}): Blob {
    if (format === "xlsx") return new Blob([toXlsx(table, options) as BlobPart], { type: MIME_TYPES.xlsx });
    const text = toDelimited(table, { delimiter: format === "tsv" ? "\t" : ",", header: options.header, bom: true });
    return new Blob([text], { type: MIME_TYPES[format] });
}

/** A filename with the format's extension, without doubling one the name already has. */
export function exportFilename(base: string, format: ExportFormat): string {
    const cleaned = base.replace(/[\\/:*?"<>|\u0000-\u001F]/g, "-").trim() || "export";
    return cleaned.toLowerCase().endsWith(`.${format}`) ? cleaned : `${cleaned}.${format}`;
}

/** Saves a blob through a temporary link. Does nothing outside a browser. */
export function downloadBlob(blob: Blob, filename: string): void {
    if (typeof document === "undefined" || typeof URL === "undefined" || !URL.createObjectURL) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Revoking at once can cancel the download in some browsers.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
