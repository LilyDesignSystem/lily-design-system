// Table export for DataGrid: CSV, TSV and Excel (.xlsx), as pure static functions.
//
// Ported from the canonical Svelte package's export-data.ts. Nothing here knows
// about the grid: a table is a header row plus rows of cell values, and every
// function turns one into text or bytes, so a consumer who wants their own
// export button (or a server-side export) can call them directly.
//
// The .xlsx writer has no dependencies: a workbook is a ZIP of a few XML parts,
// and the ZIP here only *stores* (no compression), which Excel, LibreOffice,
// Numbers and Google Sheets all read. Entries carry a fixed timestamp, so the
// same table always produces the same bytes.

using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>The file formats an export can produce.</summary>
public enum DataGridExportFormat
{
    Csv,
    Tsv,
    Xlsx,
}

/// <summary>
/// A live formula and the result it last computed. In an .xlsx the cell keeps the formula with the result cached
/// (a spreadsheet user keeps the live formula); CSV and TSV carry only the result.
/// </summary>
public sealed record ExportFormula(string Formula, object? Result);

/// <summary>A header row and rows of cell values. A cell is a string, number, boolean, <see cref="DateTime"/>, <see cref="DateOnly"/>, an <see cref="ExportFormula"/>, or null.</summary>
public sealed record ExportTable(IReadOnlyList<string> Headers, IReadOnlyList<IReadOnlyList<object?>> Rows);

/// <summary>Options for <see cref="ExportData.ToDelimited"/>.</summary>
public sealed record DelimitedOptions
{
    /// <summary>Field separator. Default <c>","</c> (use <c>"\t"</c> for TSV).</summary>
    public string Delimiter { get; init; } = ",";

    /// <summary>Write the header row. Default true.</summary>
    public bool Header { get; init; } = true;

    /// <summary>Prefix a UTF-8 byte-order mark so Excel opens the file as UTF-8. Default false.</summary>
    public bool Bom { get; init; }

    /// <summary>Defuse spreadsheet formulas: a string starting with <c>=</c>, <c>+</c>, <c>-</c>, <c>@</c>, tab or CR gets a leading <c>'</c>. Default true.</summary>
    public bool Safe { get; init; } = true;

    /// <summary>Line ending. Default <c>"\r\n"</c> (RFC 4180).</summary>
    public string Eol { get; init; } = "\r\n";
}

/// <summary>CSV, TSV and .xlsx writers and the ZIP they sit in.</summary>
public static class ExportData
{
    /// <summary>The MIME type of each format.</summary>
    public static string MimeType(DataGridExportFormat format) => format switch
    {
        DataGridExportFormat.Csv => "text/csv;charset=utf-8",
        DataGridExportFormat.Tsv => "text/tab-separated-values;charset=utf-8",
        _ => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };

    private static readonly Regex FormulaStart = new(@"^[=+\-@\t\r]", RegexOptions.Compiled);

    /// <summary>One cell as text. Numbers and booleans are never treated as formulas; only strings are defused.</summary>
    public static string CellText(object? value, bool safe = true)
    {
        switch (value)
        {
            case null:
                return "";
            case ExportFormula formula:
                return CellText(formula.Result, safe);
            case DateOnly dateOnly:
                return dateOnly.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
            case DateTime dateTime:
            {
                // A date at exactly UTC midnight is a civil date: write it without a time of day.
                var utc = dateTime.Kind == DateTimeKind.Local ? dateTime.ToUniversalTime() : dateTime;
                return utc.TimeOfDay == TimeSpan.Zero
                    ? utc.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)
                    : utc.ToString("yyyy-MM-dd'T'HH:mm:ss.fff'Z'", CultureInfo.InvariantCulture);
            }
            case bool flag:
                return flag ? "TRUE" : "FALSE";
            case double d:
                return double.IsFinite(d) ? d.ToString("R", CultureInfo.InvariantCulture) : "";
            case float f:
                return float.IsFinite(f) ? f.ToString("R", CultureInfo.InvariantCulture) : "";
            case IFormattable number when IsNumber(value):
                return number.ToString(null, CultureInfo.InvariantCulture);
        }
        var text = value.ToString() ?? "";
        return safe && FormulaStart.IsMatch(text) ? "'" + text : text;
    }

    private static bool IsNumber(object value) => value is int or long or short or byte or sbyte or uint or ulong or ushort or decimal;

    private static string QuoteField(string text, string delimiter)
        => text.Contains(delimiter, StringComparison.Ordinal) || text.IndexOfAny(new[] { '"', '\r', '\n' }) >= 0
            ? "\"" + text.Replace("\"", "\"\"", StringComparison.Ordinal) + "\""
            : text;

    /// <summary>CSV/TSV text for a table. Fields containing the delimiter, a quote or a line break are quoted.</summary>
    public static string ToDelimited(ExportTable table, DelimitedOptions? options = null)
    {
        var o = options ?? new DelimitedOptions();
        var lines = new List<string>();
        if (o.Header) lines.Add(string.Join(o.Delimiter, table.Headers.Select(h => QuoteField(CellText(h, o.Safe), o.Delimiter))));
        foreach (var row in table.Rows)
        {
            lines.Add(string.Join(o.Delimiter, table.Headers.Select((_, i) => QuoteField(CellText(i < row.Count ? row[i] : null, o.Safe), o.Delimiter))));
        }
        return (o.Bom ? "\uFEFF" : "") + string.Join(o.Eol, lines) + (lines.Count > 0 ? o.Eol : "");
    }

    /// <summary>CSV text for a table.</summary>
    public static string ToCsv(ExportTable table, DelimitedOptions? options = null)
        => ToDelimited(table, (options ?? new DelimitedOptions()) with { Delimiter = "," });

    /// <summary>TSV text for a table.</summary>
    public static string ToTsv(ExportTable table, DelimitedOptions? options = null)
        => ToDelimited(table, (options ?? new DelimitedOptions()) with { Delimiter = "\t" });

    // -------------------------------------------------------------------
    // Excel (.xlsx)
    // -------------------------------------------------------------------

    /// <summary>XML text with the characters XML 1.0 forbids removed.</summary>
    private static string XmlEscape(string text)
    {
        var sb = new StringBuilder(text.Length);
        foreach (var c in text)
        {
            if (c <= 0x08 || c == 0x0B || c == 0x0C || (c >= 0x0E && c <= 0x1F) || c == '￾' || c == '￿') continue;
            sb.Append(c switch { '&' => "&amp;", '<' => "&lt;", '>' => "&gt;", _ => c.ToString() });
        }
        return sb.ToString();
    }

    /// <summary>Column index (0-based) to a spreadsheet column name: 0 → A, 25 → Z, 26 → AA.</summary>
    public static string ColumnName(int index)
    {
        var n = index;
        var name = "";
        do
        {
            name = (char)(65 + n % 26) + name;
            n = n / 26 - 1;
        } while (n >= 0);
        return name;
    }

    /// <summary>Days since 1899-12-30 (Excel's day 0, with its 1900 leap-year quirk absorbed), with the time of day as a fraction.</summary>
    private static double ExcelSerial(DateTime utc)
        => (utc - DateTime.UnixEpoch).TotalMilliseconds / 86_400_000d + 25_569d;

    private static string SheetNameFor(string name)
    {
        var cleaned = Regex.Replace(Regex.Replace(name, @"[\[\]:*?/\\]", " "), @"\s+", " ").Trim();
        if (cleaned.Length > 31) cleaned = cleaned[..31];
        return cleaned.Length == 0 ? "Sheet1" : cleaned;
    }

    // Cell styles: 0 default, 1 date, 2 date and time, 3 bold (headers).
    private const string StylesXml =
        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>" +
        "<styleSheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">" +
        "<numFmts count=\"2\"><numFmt numFmtId=\"164\" formatCode=\"yyyy\\-mm\\-dd\"/><numFmt numFmtId=\"165\" formatCode=\"yyyy\\-mm\\-dd\\ hh:mm:ss\"/></numFmts>" +
        "<fonts count=\"2\"><font><sz val=\"11\"/><name val=\"Calibri\"/></font><font><b/><sz val=\"11\"/><name val=\"Calibri\"/></font></fonts>" +
        "<fills count=\"2\"><fill><patternFill patternType=\"none\"/></fill><fill><patternFill patternType=\"gray125\"/></fill></fills>" +
        "<borders count=\"1\"><border><left/><right/><top/><bottom/><diagonal/></border></borders>" +
        "<cellStyleXfs count=\"1\"><xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\"/></cellStyleXfs>" +
        "<cellXfs count=\"4\">" +
        "<xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\" xfId=\"0\"/>" +
        "<xf numFmtId=\"164\" fontId=\"0\" fillId=\"0\" borderId=\"0\" xfId=\"0\" applyNumberFormat=\"1\"/>" +
        "<xf numFmtId=\"165\" fontId=\"0\" fillId=\"0\" borderId=\"0\" xfId=\"0\" applyNumberFormat=\"1\"/>" +
        "<xf numFmtId=\"0\" fontId=\"1\" fillId=\"0\" borderId=\"0\" xfId=\"0\" applyFont=\"1\"/>" +
        "</cellXfs>" +
        "<cellStyles count=\"1\"><cellStyle name=\"Normal\" xfId=\"0\" builtinId=\"0\"/></cellStyles>" +
        "</styleSheet>";

    private static string Num(double d) => d.ToString("R", CultureInfo.InvariantCulture);

    private static DateTime? AsUtc(object? value) => value switch
    {
        DateOnly d => new DateTime(d.Year, d.Month, d.Day, 0, 0, 0, DateTimeKind.Utc),
        DateTime dt => dt.Kind == DateTimeKind.Local ? dt.ToUniversalTime() : DateTime.SpecifyKind(dt, DateTimeKind.Utc),
        _ => null,
    };

    /// <summary>A formula cell: the expression (without its leading <c>=</c>) and the result it last computed, cached.</summary>
    private static string FormulaXml(string reference, ExportFormula value)
    {
        var expression = XmlEscape(value.Formula.StartsWith('=') ? value.Formula[1..] : value.Formula);
        var result = value.Result;
        if (AsUtc(result) is { } utc)
        {
            var style = utc.TimeOfDay != TimeSpan.Zero ? 2 : 1;
            return $"<c r=\"{reference}\" s=\"{style}\"><f>{expression}</f><v>{Num(ExcelSerial(utc))}</v></c>";
        }
        switch (result)
        {
            case null:
                return $"<c r=\"{reference}\"><f>{expression}</f></c>";
            case bool flag:
                return $"<c r=\"{reference}\" t=\"b\"><f>{expression}</f><v>{(flag ? 1 : 0)}</v></c>";
            case double d when double.IsFinite(d):
                return $"<c r=\"{reference}\"><f>{expression}</f><v>{Num(d)}</v></c>";
            case float f when float.IsFinite(f):
                return $"<c r=\"{reference}\"><f>{expression}</f><v>{Num(f)}</v></c>";
            case IFormattable number when IsNumber(result):
                return $"<c r=\"{reference}\"><f>{expression}</f><v>{number.ToString(null, CultureInfo.InvariantCulture)}</v></c>";
        }
        return $"<c r=\"{reference}\" t=\"str\"><f>{expression}</f><v>{XmlEscape(result.ToString() ?? "")}</v></c>";
    }

    private static string CellXml(string reference, object? value, bool headerStyle = false)
    {
        if (value is null) return "";
        if (value is ExportFormula formula) return FormulaXml(reference, formula);
        var s = headerStyle ? " s=\"3\"" : "";
        if (AsUtc(value) is { } utc)
        {
            var style = utc.TimeOfDay != TimeSpan.Zero ? 2 : 1;
            return $"<c r=\"{reference}\" s=\"{style}\"><v>{Num(ExcelSerial(utc))}</v></c>";
        }
        switch (value)
        {
            case bool flag:
                return $"<c r=\"{reference}\"{s} t=\"b\"><v>{(flag ? 1 : 0)}</v></c>";
            case double d:
                return double.IsFinite(d) ? $"<c r=\"{reference}\"{s}><v>{Num(d)}</v></c>" : "";
            case float f:
                return float.IsFinite(f) ? $"<c r=\"{reference}\"{s}><v>{Num(f)}</v></c>" : "";
            case IFormattable number when IsNumber(value):
                return $"<c r=\"{reference}\"{s}><v>{number.ToString(null, CultureInfo.InvariantCulture)}</v></c>";
        }
        // A string is stored as text, so it is never read as a formula.
        return $"<c r=\"{reference}\"{s} t=\"inlineStr\"><is><t xml:space=\"preserve\">{XmlEscape(value.ToString() ?? "")}</t></is></c>";
    }

    private static string SheetXml(ExportTable table, bool header)
    {
        var rows = new List<string>();
        var rowNumber = 0;
        if (header)
        {
            rowNumber++;
            var n = rowNumber;
            rows.Add($"<row r=\"{n}\">{string.Concat(table.Headers.Select((h, i) => CellXml($"{ColumnName(i)}{n}", h, true)))}</row>");
        }
        foreach (var row in table.Rows)
        {
            rowNumber++;
            var n = rowNumber;
            rows.Add($"<row r=\"{n}\">{string.Concat(table.Headers.Select((_, i) => CellXml($"{ColumnName(i)}{n}", i < row.Count ? row[i] : null)))}</row>");
        }
        return
            "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>" +
            "<worksheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">" +
            (header && table.Headers.Count > 0 ? "<sheetViews><sheetView workbookViewId=\"0\"><pane ySplit=\"1\" topLeftCell=\"A2\" activePane=\"bottomLeft\" state=\"frozen\"/></sheetView></sheetViews>" : "") +
            $"<sheetData>{string.Concat(rows)}</sheetData></worksheet>";
    }

    /// <summary>An .xlsx workbook with one worksheet, as bytes.</summary>
    public static byte[] ToXlsx(ExportTable table, string sheetName = "Sheet1", bool header = true)
    {
        var files = new List<(string Name, byte[] Data)>
        {
            ("[Content_Types].xml", Utf8(
                "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>" +
                "<Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">" +
                "<Default Extension=\"rels\" ContentType=\"application/vnd.openxmlformats-package.relationships+xml\"/>" +
                "<Default Extension=\"xml\" ContentType=\"application/xml\"/>" +
                "<Override PartName=\"/xl/workbook.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\"/>" +
                "<Override PartName=\"/xl/worksheets/sheet1.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\"/>" +
                "<Override PartName=\"/xl/styles.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml\"/>" +
                "</Types>")),
            ("_rels/.rels", Utf8(
                "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>" +
                "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">" +
                "<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\" Target=\"xl/workbook.xml\"/>" +
                "</Relationships>")),
            ("xl/workbook.xml", Utf8(
                "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>" +
                "<workbook xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\">" +
                $"<sheets><sheet name=\"{XmlEscape(SheetNameFor(sheetName))}\" sheetId=\"1\" r:id=\"rId1\"/></sheets></workbook>")),
            ("xl/_rels/workbook.xml.rels", Utf8(
                "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>" +
                "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">" +
                "<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" Target=\"worksheets/sheet1.xml\"/>" +
                "<Relationship Id=\"rId2\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles\" Target=\"styles.xml\"/>" +
                "</Relationships>")),
            ("xl/styles.xml", Utf8(StylesXml)),
            ("xl/worksheets/sheet1.xml", Utf8(SheetXml(table, header))),
        };
        return ZipStore(files);
    }

    private static byte[] Utf8(string text) => new UTF8Encoding(false).GetBytes(text);

    // -------------------------------------------------------------------
    // ZIP (store only)
    // -------------------------------------------------------------------

    private static uint[]? _crcTable;

    /// <summary>The CRC-32 of some bytes (the ZIP checksum).</summary>
    public static uint Crc32(ReadOnlySpan<byte> bytes)
    {
        if (_crcTable is null)
        {
            var table = new uint[256];
            for (uint n = 0; n < 256; n++)
            {
                var c = n;
                for (var k = 0; k < 8; k++) c = (c & 1) != 0 ? 0xEDB88320u ^ (c >> 1) : c >> 1;
                table[n] = c;
            }
            _crcTable = table;
        }
        var crc = 0xFFFFFFFFu;
        foreach (var b in bytes) crc = _crcTable[(crc ^ b) & 0xFF] ^ (crc >> 8);
        return crc ^ 0xFFFFFFFFu;
    }

    // 1980-01-01 00:00:00, the ZIP epoch: a fixed stamp keeps the output reproducible.
    private const ushort DosTime = 0x0000;
    private const ushort DosDate = 0x0021;

    private static void Put16(Stream s, int v) { s.WriteByte((byte)v); s.WriteByte((byte)(v >> 8)); }
    private static void Put32(Stream s, uint v) { Put16(s, (int)(v & 0xFFFF)); Put16(s, (int)(v >> 16)); }

    /// <summary>A ZIP archive holding <paramref name="entries"/> uncompressed.</summary>
    public static byte[] ZipStore(IReadOnlyList<(string Name, byte[] Data)> entries)
    {
        using var output = new MemoryStream();
        using var central = new MemoryStream();
        uint offset = 0;
        foreach (var (name, data) in entries)
        {
            var nameBytes = Utf8(name);
            var crc = Crc32(data);
            Put32(output, 0x04034B50u);
            Put16(output, 20); // version needed
            Put16(output, 0x0800); // flags: UTF-8 names
            Put16(output, 0); // method: stored
            Put16(output, DosTime);
            Put16(output, DosDate);
            Put32(output, crc);
            Put32(output, (uint)data.Length);
            Put32(output, (uint)data.Length);
            Put16(output, nameBytes.Length);
            Put16(output, 0);
            output.Write(nameBytes);
            output.Write(data);

            Put32(central, 0x02014B50u);
            Put16(central, 20); // version made by
            Put16(central, 20); // version needed
            Put16(central, 0x0800);
            Put16(central, 0);
            Put16(central, DosTime);
            Put16(central, DosDate);
            Put32(central, crc);
            Put32(central, (uint)data.Length);
            Put32(central, (uint)data.Length);
            Put16(central, nameBytes.Length);
            Put16(central, 0); // extra length
            Put16(central, 0); // comment length
            Put16(central, 0); // disk number
            Put16(central, 0); // internal attributes
            Put32(central, 0); // external attributes
            Put32(central, offset);
            central.Write(nameBytes);

            offset += (uint)(30 + nameBytes.Length + data.Length);
        }
        var centralBytes = central.ToArray();
        output.Write(centralBytes);
        Put32(output, 0x06054B50u);
        Put16(output, 0);
        Put16(output, 0);
        Put16(output, entries.Count);
        Put16(output, entries.Count);
        Put32(output, (uint)centralBytes.Length);
        Put32(output, offset);
        Put16(output, 0);
        return output.ToArray();
    }

    // -------------------------------------------------------------------
    // Files
    // -------------------------------------------------------------------

    /// <summary>The bytes of the file for <paramref name="table"/> in <paramref name="format"/>. CSV and TSV carry a UTF-8 byte-order mark so Excel reads them as UTF-8.</summary>
    public static byte[] ExportBytes(ExportTable table, DataGridExportFormat format, string sheetName = "Sheet1", bool header = true)
    {
        if (format == DataGridExportFormat.Xlsx) return ToXlsx(table, sheetName, header);
        var text = ToDelimited(table, new DelimitedOptions { Delimiter = format == DataGridExportFormat.Tsv ? "\t" : ",", Header = header, Bom = true });
        return Utf8(text);
    }

    /// <summary>A filename with the format's extension, without doubling one the name already has.</summary>
    public static string ExportFilename(string baseName, DataGridExportFormat format)
    {
        var cleaned = Regex.Replace(baseName, "[\\\\/:*?\"<>|\\u0000-\\u001F]", "-").Trim();
        if (cleaned.Length == 0) cleaned = "export";
        var extension = format.ToString().ToLowerInvariant();
        return cleaned.EndsWith("." + extension, StringComparison.OrdinalIgnoreCase) ? cleaned : $"{cleaned}.{extension}";
    }
}
